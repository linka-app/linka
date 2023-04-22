import { useEffect, useState } from 'react';
import Auth from '../pages/Auth';
import Main from '../pages/Main';
import { Props } from '../types';
import { getAuth } from '../utils/getAuth';

function Linka(props: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // check token and url
    if (getAuth()) {
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

export default Linka;
