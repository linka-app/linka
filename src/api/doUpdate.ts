import { bookmarkArgs } from '../types';
import { getAuth } from '../utils/getAuth';

export async function doUpdate(args: bookmarkArgs) {
  const auth = getAuth();

  if (auth.token && auth.url) {
    const endpoint = `${auth.url}/api/bookmarks/${args.id}/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'PUT',
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

export default doUpdate;
