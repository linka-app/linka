import { useEffect, useState } from 'react';
import Auth from '../pages/Auth';
import Main from '../pages/Main';
import { getConfig } from '../utils/getConfig';

function Router() {
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
}

export default Router;
