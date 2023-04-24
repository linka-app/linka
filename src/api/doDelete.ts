import { doArgs } from '../types';
import { getConfig } from '../utils/getConfig';

export async function doDelete(args: doArgs) {
  const config = getConfig();
  if (config.token && config.url) {
    const endpoint = `${config.url}/api/bookmarks/${args.id}/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${config.token}`,
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
