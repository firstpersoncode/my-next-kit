import { createSession, withSession, serializeToken } from "context/Client/api/session";

export default withSession(
  async function signin(req, res) {
    try {
      const session = await createSession(req.headers["user-agent"]);
      const cookie = serializeToken(session.sjwt);
      res.setHeader("Set-Cookie", cookie);
      return res.status(200).send(session.sjwt);
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  },
  { byPassSession: true }
);
