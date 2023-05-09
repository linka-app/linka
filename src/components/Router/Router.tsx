import Auth from "@/pages/Auth/Auth";
import Main from "@/pages/Main/Main";
import { useEffect, useState } from "react";
import { useContexts } from "@/hooks";
import { LinkaPartialSettings } from "@/types";

// read basic configs from shared url and set them
const initConfigFromQuery = (
  setConfig: (config: LinkaPartialSettings) => void
) => {
  const params = new URLSearchParams(window.location.href);
  const url = decodeURIComponent(params.get("url") || "");
  const token = params.get("token");
  if (url && token) {
    setConfig({ url, token });
    window.location.href = window.location.origin;
  }
};

export const Router: React.FC = () => {
  const { config, setConfig } = useContexts();
  initConfigFromQuery(setConfig);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    // check token and url
    if (config.token && config.url) {
      setReady(true);
    }
  }, []);

  return (
    <>
      {ready ? (
        // search main page
        <Main />
      ) : (
        // setup setting page
        <Auth setReady={setReady} />
      )}
    </>
  );
};

export default Router;
