import Auth from '@/pages/Auth/Auth';
import Main from '@/pages/Main/Main';
// FIXME: reduce duplicate parts in path...
import { getConfig } from '@/utils/getConfig/getConfig';
import { setConfig } from '@/utils/setConfig/setConfig';
import { useEffect, useState } from 'react';

// read basic configs from shared url and set them
const initConfigFromQuery = () => {
  const params = new URLSearchParams(window.location.href);
  const url = decodeURIComponent(params.get('url') || '');
  const token = params.get('token');
  if (url && token) {
    setConfig({ url, token });
    window.location.href = window.location.origin;
  }
};

export const Router: React.FC = () => {
  initConfigFromQuery();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    // check token and url
    if (getConfig().token && getConfig().url) {
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
