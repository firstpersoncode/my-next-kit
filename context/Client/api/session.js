import axios from "axios";
import { parse } from "next-useragent";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { add, format } from "date-fns";
import getUrl from "../utils/getUrl";
import prismaClient from "./prismaClient";
import { context } from "..";

const validateSession = ({ authorization }) => {
  return authorization === `Bearer ${process.env.API_SECRET_KEY}`;
};

export function withSession(handler, { methods = ["GET"], byPassSession = false, autoSignin = false }) {
  return async (req, res) => {
    if (!methods.includes(req.method)) return res.status(404).send();
    if (!validateSession({ authorization: req.headers["authorization"] })) return res.status(403).send();

    if (byPassSession) return handler(req, res);

    if (autoSignin) {
      const session = await createSession(req.headers["user-agent"]);
      req.session = session;
    } else req.session = await getSession(req.cookies._sjwt);

    if (!req.session) return res.status(400).send();

    return handler(req, res);
  };
}

async function getSession(sjwt) {
  if (!sjwt) return;
  const db = await prismaClient();
  const session = await db.findUnique({
    where: { sjwt }
  });

  return session;
}

const days = 3;
const maxAge = 60 * 60 * 24 * days;

export async function refreshSession(session) {
  const exp = add(new Date(), { days });
  const db = await prismaClient();
  const refreshedSession = await db.update({
    where: { sjwt: session.sjwt },
    data: { ...session, exp }
  });

  const token = serializeToken(refreshedSession.sjwt);
  return token;
}

export async function createSession(uaString) {
  const userAgent = { ...parse(uaString) };
  const exp = add(new Date(), { days });
  const _sjwt = sign({ ...userAgent, exp: Number(format(new Date(exp), "t")) }, process.env.JWT_SECRET_KEY);
  const db = await prismaClient();
  const newSession = await db.create({
    data: {
      exp,
      sjwt: _sjwt,
      source: userAgent.source,
      deviceType: userAgent.deviceType,
      deviceVendor: userAgent.deviceVendor,
      os: userAgent.os,
      osVersion: userAgent.osVersion,
      browser: userAgent.browser,
      browserVersion: userAgent.browserVersion,
      isBot: userAgent.isBot
    }
  });

  const token = serializeToken(newSession.sjwt);
  return token;
}

export async function deleteSession(session) {
  const db = await prismaClient();
  await db.delete({ where: { sjwt: session.sjwt } });
  const token = serializeToken(null, -1);
  return token;
}

function serializeToken(sjwt, overrideMaxAge = maxAge) {
  return serialize("_sjwt", sjwt, {
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: overrideMaxAge,
    path: "/"
  });
}

export function refresh() {
  return axios.get("/api/auth/refresh", { headers: { authorization: `Bearer ${process.env.API_SECRET_KEY}` } });
}

export function signin() {
  return axios.get("/api/auth/signin", { headers: { authorization: `Bearer ${process.env.API_SECRET_KEY}` } });
}

export async function getInitialClientContext(nextContext) {
  context.rendered = false;

  context.url = getUrl(nextContext.req.headers.host, nextContext.locale, nextContext.resolvedUrl);
  context.source = nextContext.req.headers["user-agent"];
  context.userAgent = parse(context.source);
  context.isMobile = context.userAgent.isMobile;

  return context;
}
