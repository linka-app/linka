import { queryBookmarkArgs } from '@/types';
import { getConfig } from '@/utils/getConfig';

export async function getBookmarks(args: queryBookmarkArgs) {
  const config = getConfig();
  if (config.token && config.url) {
    const endpoint = `${config.url}/api/bookmarks`;
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
        Authorization: `Token ${config.token}`,
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
