export async function doAuth(args: { token: string; url: string }) {
  const endpoint = `${args.url}/api/bookmarks`;
  let url = new URL(endpoint);
  const res = await fetch(url, {
    headers: {
      Authorization: `Token ${args.token}`,
    },
  });
  if (res.ok) {
    return true;
  }
  return await Promise.reject(`status code: ${res.status}`);
}

export default doAuth;
