import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import useIsMobile from "./hooks/useIsMobile";
import useUserAgent from "./hooks/useUserAgent";
import { refresh, signin } from "./api/session";
import { verifyCaptcha } from "./api/hcaptcha";

export const context = {
  session: "",
  url: "",
  source: "",
  userAgent: {},
  isMobile: false,
  rendered: false,
  openSessionModal: false
};

const ClientContext = createContext(context);

export const useClientContext = () => useContext(ClientContext);

const useContextController = context => {
  const captchaRef = useRef();

  const userAgent = useUserAgent();
  const isMobile = useIsMobile();
  const [ctx, setContext] = useState({ ...context, userAgent, isMobile });

  useEffect(() => {
    setContext(v => ({ ...v, rendered: true }));
  }, []);

  const refreshSession = async sessionModalMessage => {
    if (ctx.session) return;

    try {
      const response = await refresh();
      const { data } = response;
      setContext(v => ({ ...v, session: data, openSessionModal: false }));
    } catch (err) {
      console.error(err);
      setContext(v => ({ ...v, openSessionModal: true, sessionModalMessage }));
    }
  };

  useEffect(() => {
    if (!ctx.rendered) return;
    refreshSession("Accept cookie?");
  }, [ctx.rendered]);

  const onConfirmSession = async () => {
    try {
      const response = await signin();
      const { data } = response;
      setContext(v => ({ ...v, session: data, openSessionModal: false }));
      if (ctx.awaitRecaptchaExecute) {
        captchaRef.current.execute();
        setContext(v => ({ ...v, awaitRecaptchaExecute: false }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onRejectSession = () => {
    setContext(v => ({ ...v, openSessionModal: false }));
  };

  const resetCaptcha = () => {
    captchaRef.current.resetCaptcha();
  };

  const captchaExecute = async (endpoint, body, onSuccess, onError) => {
    setContext(v => ({ ...v, endpoint, body, onSuccess, onError }));

    if (!ctx.session) {
      setContext(v => ({ ...v, awaitRecaptchaExecute: true }));
      refreshSession("Accept cookie before continuing your action");
    } else captchaRef.current.execute();
  };

  const onCaptchaVerify = async captcha => {
    try {
      const response = await verifyCaptcha(ctx.endpoint, ctx.body, captcha);
      if (typeof ctx.onSuccess === "function") {
        ctx.onSuccess(response);
        setContext(v => ({ ...v, onSuccess: undefined }));
      }
    } catch (err) {
      if (typeof ctx.onError === "function") {
        ctx.onError(err);
        setContext(v => ({ ...v, onError: undefined }));
      }
    } finally {
      resetCaptcha();
    }
  };

  return {
    ...ctx,
    setContext,
    captchaRef,
    onCaptchaVerify,
    captchaExecute,
    resetCaptcha,
    refreshSession,
    onConfirmSession,
    onRejectSession
  };
};

export default function ClientContextProvider({ children, context }) {
  const { captchaRef, onCaptchaVerify, resetCaptcha, onRejectSession, onConfirmSession, openSessionModal, sessionModalMessage, ...controlledContext } =
    useContextController(context);

  return (
    <ClientContext.Provider value={controlledContext}>
      {children}
      <HCaptcha
        ref={captchaRef}
        size="invisible"
        sitekey={process.env.HCAPTCHA_SITE_KEY}
        onVerify={onCaptchaVerify}
        onError={resetCaptcha}
        onClose={resetCaptcha}
        onChalExpired={resetCaptcha}
      />
      <Dialog onClose={onRejectSession} open={openSessionModal}>
        <DialogTitle>{sessionModalMessage}</DialogTitle>
        <DialogContent>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem quos architecto quibusdam minima, accusamus nam aut quia velit repellat quod voluptatem! Consectetur
          commodi eaque autem? Doloremque quia impedit dolor voluptatem.
        </DialogContent>
        <DialogActions>
          <Button onClick={onRejectSession}>Cancel</Button>
          <Button onClick={onConfirmSession} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ClientContext.Provider>
  );
}
