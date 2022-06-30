import { createTheme, ThemeProvider } from "@mui/material/styles";
import ClientContextProvider from "context/Client";
import { getInitialClientContext } from "context/Client/api/session";
import CmsContextProvider from "context/Cms";
import { getInitialCmsContext } from "context/Cms/api/strapi";
import MeteHead from "component/MetaHead";
import Header from "component/Header";
import Content from "component/Content";
import Footer from "component/Footer";

export default function PageRoute({ clientContext, cmsContext }) {
  return (
    <ClientContextProvider context={clientContext}>
      <CmsContextProvider context={cmsContext}>
        <ThemeProvider
          theme={createTheme({
            typography: {
              fontFamily: '"Avenir Next LT Pro", sans-serif'
            }
          })}>
          <MeteHead />
          <Header />
          {Array.isArray(cmsContext.page?.components) && cmsContext.page?.components.map((c, i) => <Content key={i} component={c} />)}
          <Footer />
        </ThemeProvider>
      </CmsContextProvider>
    </ClientContextProvider>
  );
}

export const getServerSideProps = async nextContext => {
  const clientContext = await getInitialClientContext(nextContext);
  const cmsContext = await getInitialCmsContext(nextContext);

  return {
    redirect: cmsContext.redirect || undefined,
    props: { clientContext, cmsContext },
    notFound: !cmsContext.page?.id
  };
};
