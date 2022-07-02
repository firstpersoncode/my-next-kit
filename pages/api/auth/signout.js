import { withSession, deleteSession } from "context/Client/api/session";

export default withSession(async function signout(req, res) {
  try {
    const token = await deleteSession(req.session);
    res.setHeader("Set-Cookie", token);
    return res.status(200).send("Session removed");
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}, {});
