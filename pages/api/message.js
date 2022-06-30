import axios from "axios";
import { withSession } from "context/Client/api/session";
import { withCaptcha } from "context/Client/api/hcaptcha";

export default withSession(
  withCaptcha(async function message(req, res) {
    const { Hello } = req.body;

    if (Hello !== "World") return res.status(422).send();

    try {
      const response = await axios.post(
        "https://5cb4c4aabbf7b50014cabcc0.mockapi.io/api/v1/messages",
        {
          Hello
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      return res.status(200).send(response.data?.message);
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  }, {}),
  { methods: ["POST"] }
);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb"
    }
  }
};
