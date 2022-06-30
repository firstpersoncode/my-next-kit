import URI from "urijs";
import fs from "fs";
import { SitemapStream } from "sitemap";
import getAppName from "../utils/getAppName";

const GET_SITES = gql`
  query GET_SITES($appName: String!) {
    apps(where: { appName: $appName }) {
      hostname
      defaultLocale
    }
    pages(where: { appName: $appName, published: true, index: true }) {
      id
      slug
      updatedAt
    }
  }
`;

function getSites(appName) {
  return apolloClient.query({
    query: GET_SITES,
    variables: { appName }
  });
}

export async function generateSiteMap(appName) {
  const sites = await getSites();

  const hostname = sites.data.apps[0].hostname;
  const sitemapStream = new SitemapStream({ hostname, xmlns: { xhtml: true } });
  const homePage = sites.data.pages.find(e => e.slug === "home");
  const pages = sites.data.pages.filter(e => e.slug !== "home");
  homePage.slug = "/";
  const siteInfo = pages.concat(homePage);
  const defaultLocale = sites.data.apps[0].defaultLocale;
  siteInfo.forEach(p => {
    sitemapStream.write({
      url: new URI(hostname).segment(defaultLocale).segment(p.slug.toLowerCase()).normalize().toString().replace(/\/$/, ""),
      lastmod: p.updatedAt
    });
  });

  const dir = "/tmp";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const path = `${dir}/${appName}_sitemap.xml`;
  const writeStream = fs.createWriteStream(path);
  sitemapStream.pipe(writeStream);
  sitemapStream.end();
}

function getSiteMapFile(host) {
  const appName = getAppName(host);
  return new Promise((resolve, reject) => {
    fs.readFile(`/tmp/${appName}_sitemap.xml`, "utf8", (err, data) => {
      if (err) reject(err.message);
      else resolve(data);
    });
  });
}

export const renderSiteMap = async nextContext => {
  try {
    const content = await getSiteMapFile(nextContext.req.headers.host);
    nextContext.res.setHeader("Content-Type", "text/xml");
    nextContext.res.write(content);
    nextContext.res.end();
  } catch (err) {
    console.log(err.toString());
  }
};
