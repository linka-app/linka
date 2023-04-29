import Auth from '@/pages/Auth/Auth';
import Main from '@/pages/Main/Main';
import { getConfig } from '@/utils/getConfig/getConfig';
import { useEffect, useState } from 'react';

export const Router: React.FC = () => {
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
