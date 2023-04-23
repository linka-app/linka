import { getAuth } from '../utils/getAuth';

export async function getTags() {
  const auth = getAuth();
  if (auth.token && auth.url) {
    const endpoint = `${auth.url}/api/tags/`;
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

export default getTags;
