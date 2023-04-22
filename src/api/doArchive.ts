import { doArgs } from '../types';
import { getAuth } from '../utils/getAuth';

export async function doArchive(args: doArgs) {
  const auth = getAuth();
  if (auth) {
    const endpoint = `${auth.url}/api/bookmarks/${args.id}/archive/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${auth.token}`,
      },
    });
    if (res.ok) {
      return true;
    }
    return await Promise.reject(`status code: ${res.status}`);
  } else {
    return await Promise.reject(`no auth`);
  }
}

export default doArchive;
