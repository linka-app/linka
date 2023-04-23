import { bookmarkArgs } from '../types';
import { getAuth } from '../utils/getAuth';

export async function doCreate(args: Omit<bookmarkArgs, 'id'>) {
  const auth = getAuth();

  if (auth) {
    const endpoint = `${auth.url}/api/bookmarks/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args.payload),
    });
    console.log(res);
    if (res.ok) {
      return true;
    }
    return await Promise.reject(`status code: ${res.status}`);
  } else {
    return await Promise.reject(`no auth`);
  }
}

export default doCreate;
