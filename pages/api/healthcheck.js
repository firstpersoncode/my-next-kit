import { withSession } from "context/Client/api/session";

export default withSession(
  function healthcheck(_, res) {
    res.status(200).send("ok");
  },
  { byPassSession: true }
);
