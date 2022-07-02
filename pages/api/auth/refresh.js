import { withSession, refreshSession } from "context/Client/api/session";

export default withSession(async function refresh(req, res) {
  try {
    const token = await refreshSession(req.session);
    res.setHeader("Set-Cookie", token);
    return res.status(200).send(token);
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}, {});
