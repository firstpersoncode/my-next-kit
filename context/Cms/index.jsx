import { createContext, useContext } from "react";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./api/apolloClient";

export const context = {
  appName: "",
  app: {},
  page: {},
  navs: []
};

const CmsContext = createContext(context);

export const useCmsContext = () => useContext(CmsContext);

export default function CmsContextProvider({ children, context }) {
  return (
    <ApolloProvider client={apolloClient}>
      <CmsContext.Provider value={context}>{children}</CmsContext.Provider>
    </ApolloProvider>
  );
}
