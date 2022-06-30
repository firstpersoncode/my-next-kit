import { withSession } from "context/Client/api/session";
import { generateSiteMap } from "context/Cms/api/sitemap";

export default withSession(
  async function sitemap(req, res) {
    try {
      await generateSiteMap(req.body.appName);
      res.status(200).send("Sitemap generated");
    } catch (err) {
      console.error(err.toString());
      res.status(500).send();
    }
  },
  { methods: ["POST"] }
);
