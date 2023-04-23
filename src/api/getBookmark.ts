import { doArgs } from '../types';
import { getAuth } from '../utils/getAuth';

export async function getBookmark(args: doArgs) {
  const auth = getAuth();
  if (auth.token && auth.url) {
    const endpoint = `${auth.url}/api/bookmarks/${args.id}/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      headers: {
        Authorization: `Token ${auth.token}`,
      },
    });
    if (res.ok) {
      return res.json();
    }
    return await Promise.reject(`status code: ${res.status}`);
  } else {
    return await Promise.reject(`no auth`);
  }
}

export default getBookmark;
