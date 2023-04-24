import { doArgs } from '../types';
import { getConfig } from '../utils/getConfig';

export async function doShare(args: doArgs) {
  const config = getConfig();
  if (config.token && config.url) {
    const endpoint = `${config.url}/api/bookmarks/${args.id}/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${config.token}`,
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
