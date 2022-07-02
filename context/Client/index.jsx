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
    try {
      await refresh();
      setContext(v => ({ ...v, openSessionModal: false }));
    } catch (err) {
      console.error(err);
      setContext(v => ({ ...v, openSessionModal: true, sessionModalMessage }));
      throw err;
    }
  };

  useEffect(() => {
    if (!ctx.rendered) return;
    refreshSession("Accept cookie?");
  }, [ctx.rendered]);

  const onConfirmSession = async () => {
    try {
      await signin();
      setContext(v => ({ ...v, openSessionModal: false }));
      if (typeof ctx.onConfirmCallBack === "function") {
        ctx.onConfirmCallBack();
        setContext(v => ({ ...v, onConfirmCallBack: undefined }));
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

  const captchaExecute = async (endpoint, body, onCaptchaSuccess, onCaptchaError) => {
    setContext(v => ({ ...v, endpoint, body, onCaptchaSuccess, onCaptchaError }));

    try {
      await refreshSession("Accept cookie before continuing your action");
      captchaRef.current.execute();
    } catch (err) {
      setContext(v => ({ ...v, onConfirmCallBack: () => captchaRef.current.execute() }));
    }
  };

  const onCaptchaVerify = async captcha => {
    try {
      const response = await verifyCaptcha(ctx.endpoint, ctx.body, captcha);
      if (typeof ctx.onCaptchaSuccess === "function") {
        ctx.onCaptchaSuccess(response);
        setContext(v => ({ ...v, onCaptchaSuccess: undefined }));
      }
    } catch (err) {
      if (typeof ctx.onCaptchaError === "function") {
        ctx.onCaptchaError(err);
        setContext(v => ({ ...v, onCaptchaError: undefined }));
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
