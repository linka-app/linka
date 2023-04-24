import { queryBookmarkArgs } from '../types';
import { getAuth } from '../utils/getAuth';

export async function getBookmarks(args: queryBookmarkArgs) {
  const auth = getAuth();
  if (auth.token && auth.url) {
    const endpoint = `${auth.url}/api/bookmarks`;
    let url = new URL(endpoint);
    Object.entries(args).forEach(([k, v], idx) => {
      if (k === 'token' || k === 'url') {
        return;
      }
      if (v !== undefined) {
        url.searchParams.append(k, v.toString());
      }
    });

    url.searchParams.append('limit', '10000');

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

export default getBookmarks;
