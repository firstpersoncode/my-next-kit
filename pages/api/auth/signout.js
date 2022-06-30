import { withSession, deleteSession, serializeToken } from "context/Client/api/session";

export default withSession(async function signout(req, res) {
  try {
    await deleteSession(req.session);
    const cookie = serializeToken(null, -1);
    res.setHeader("Set-Cookie", cookie);
    return res.status(200).send("Session removed");
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}, {});
