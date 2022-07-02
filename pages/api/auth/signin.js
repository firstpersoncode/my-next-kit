import { createSession, withSession } from "context/Client/api/session";

export default withSession(
  async function signin(req, res) {
    try {
      const token = await createSession(req.headers["user-agent"]);
      res.setHeader("Set-Cookie", token);
      return res.status(200).send(token);
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  },
  { byPassSession: true }
);
