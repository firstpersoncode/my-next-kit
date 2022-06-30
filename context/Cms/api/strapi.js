import gql from "graphql-tag";
import getAppName from "../utils/getAppName";
import { context } from "..";
import apolloClient from "./apolloClient";

const imageFields = `id
  alternativeText
  url
  formats
`;

const GET_APP = gql`
  query GET_APP($appName: String!) {
    apps (
      where: { appName: $appName }
    ) {
      id
      appName
      name
      logo {
        ${imageFields}
      }
    }
    redirects (
      where: { appName: $appName }
    ) {
      id
      source
      destination
      permanent
    }
    navs (
      where: { appName: $appName }
    ) {
      id
      target
      title
      href
      image {
        ${imageFields}
      }
    }
  }
`;

function getApp(appName) {
  return apolloClient.query({
    query: GET_APP,
    variables: { appName }
  });
}

const GET_PAGE = gql`
  query GET_PAGE($appName: String!, $slug: String!) {
    pages(
      where: { appName: $appName, slug: $slug, published: true }
    ) {
      id
      title
      description
      index
      keywords
      image{
        ${imageFields}
      }
      updatedAt
      components {
        __typename
      }
    }
  }
`;

function getPage(appName, slug) {
  return apolloClient.query({
    query: GET_PAGE,
    variables: { appName, slug }
  });
}

export async function getInitialCmsContext(nextContext) {
  context.page = {};
  context.appName = getAppName(nextContext.req.headers.host);

  try {
    if (!context.app.id) {
      const app = await getApp(context.appName);
      if (app.data?.apps?.length) context.app = app.data.apps[0] || {};
      if (app.data?.navs?.length) context.navs = app.data.navs;
    }
    const slug = params?.page.join("/") || "home";
    const page = await getPage(context.appName, slug);
    if (page.data?.pages?.length) context.page = page.data.pages[0] || {};
  } catch (err) {
    console.error(err);
  }

  return context;
}
