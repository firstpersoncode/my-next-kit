import { useRouter } from "next/router";
import "styles/globals.scss";

export default function _App({ Component, pageProps }) {
  const { asPath } = useRouter();
  return <Component {...pageProps} key={asPath} />;
}
