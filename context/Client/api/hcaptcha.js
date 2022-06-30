import axios from "axios";

export function withCaptcha(handler, { byPassCaptcha = false }) {
  return async (req, res) => {
    if (byPassCaptcha) return handler(req, res);

    const { captcha } = req.query;

    if (!captcha) {
      return res.status(422).send();
    }

    try {
      const response = await axios.post("https://hcaptcha.com/siteverify", `response=${captcha}&secret=${process.env.HCAPTCHA_SECRET_KEY}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }
      });
      const captchaValidation = response.data;
      if (!captchaValidation.success) return res.status(422).send();
      return handler(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).send();
    }
  };
}

export function verifyCaptcha(endpoint, body, captcha) {
  return axios.post(`${endpoint}?captcha=${captcha}`, body, { headers: { authorization: `Bearer ${process.env.NEXTJS_SECRET_KEY}` } });
}
