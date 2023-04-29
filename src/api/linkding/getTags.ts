import { getConfig } from '@/utils/getConfig/getConfig';

export async function getTags() {
  const config = getConfig();
  if (config.token && config.url) {
    const endpoint = `${config.url}/api/tags/`;
    let url = new URL(endpoint);
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

export default getTags;
