import URI from "urijs";

export default function getAppName(host) {
  const uri = new URI(`https://${host}`);
  const appName = uri.subdomain();

  if (["www", "dev"].includes(appName)) {
    // const split = host.split(".");
    // split.shift();
    // return getAppName(split.join("."));
    return "app";
  }

  return appName;
}
