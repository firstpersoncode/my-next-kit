import { useEffect, useState } from "react";
import useUserAgent from "./useUserAgent";

export default function useIsMobile(maxWidth = 992) {
  const userAgent = useUserAgent();
  const [isMobile, setIsMobile] = useState(userAgent.isMobile);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < maxWidth);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
