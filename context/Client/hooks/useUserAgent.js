import { useEffect, useState } from "react";
import { parse } from "next-useragent";
import { useClientContext } from "..";

export default function useUserAgent() {
  const { source } = useClientContext();
  const [userAgent, setUserAgent] = useState(source);

  useEffect(() => {
    setUserAgent(navigator.userAgent);
  }, []);

  return parse(userAgent);
}
