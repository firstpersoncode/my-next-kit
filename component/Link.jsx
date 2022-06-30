import NextLink from "next/link";
import { useRouter } from "next/router";

const isValidUrl = url => {
  try {
    new URL(url);
  } catch {
    return false;
  }
  return true;
};

export default function Link({ href = "", locale, className, children, ...props }) {
  const { locale: currLocale } = useRouter();
  const defaultLocale = currLocale === "default" ? "en" : currLocale;

  const pathname = href.charAt(0) !== "/" ? "/" + href : href;
  const path = isValidUrl(href) ? href : pathname;

  return (
    <NextLink passHref href={path} locale={locale ? locale : defaultLocale}>
      <a {...props} className={className}>
        {children}
      </a>
    </NextLink>
  );
}
