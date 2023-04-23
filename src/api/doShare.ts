import { doArgs } from '../types';
import { getAuth } from '../utils/getAuth';

export async function doShare(args: doArgs) {
  const auth = getAuth();
  if (auth) {
    const endpoint = `${auth.url}/api/bookmarks/${args.id}/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shared: true }),
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

export default doShare;
