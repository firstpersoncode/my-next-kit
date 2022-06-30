import fetch from "cross-fetch";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export default new ApolloClient({
  link: new HttpLink({ uri: `${process.env.CMS_ENDPOINT}`, fetch }),
  cache: new InMemoryCache()
});
