import { doArgs } from '../types';
import { getAuth } from '../utils/getAuth';

export async function doDelete(args: doArgs) {
  const auth = getAuth();
  if (auth) {
    const endpoint = `${auth.url}/api/bookmarks/${args.id}/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'DELETE',
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

export default doDelete;
