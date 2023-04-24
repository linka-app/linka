import { bookmarkArgs } from '../types';
import { getConfig } from '../utils/getConfig';

export async function doUpdate(args: bookmarkArgs) {
  const config = getConfig();

  if (config.token && config.url) {
    const endpoint = `${config.url}/api/bookmarks/${args.id}/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Token ${config.token}`,
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
