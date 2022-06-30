import { renderSiteMap } from "context/Cms/api/sitemap";

export default function Sitemap() {
  return null;
}

export const getServerSideProps = async nextContext => {
  await renderSiteMap(nextContext);

  return {
    props: {}
  };
};
