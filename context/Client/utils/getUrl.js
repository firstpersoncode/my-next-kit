import URI from "urijs";

function removeTrailingSlash(str) {
  return str.endsWith("/") ? str.slice(0, -1) : str;
}

export default function getUrl(host, locale, resolvedUrl) {
  const uri = new URI(`https://${host}`);
  if (locale) uri.segment(0, locale === "default" ? "en" : locale);
  if (resolvedUrl) uri.segment(1, resolvedUrl);

  return removeTrailingSlash(uri.toString());
}
