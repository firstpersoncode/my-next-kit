import { withSession, refreshSession } from "context/Client/api/session";

export default withSession(async function refresh(req, res) {
  try {
    const session = await refreshSession(req.session);
    return res.status(200).send(session.sjwt);
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}, {});
