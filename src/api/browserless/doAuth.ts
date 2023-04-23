export async function doAuth(args: { token: string }) {
  const endpoint = `https://chrome.browserless.io/content`;
  let url = new URL(endpoint);
  url.searchParams.append('token', args.token);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Cache-Control': `no-cache`,
      'Content-Type': `application/json`,
    },
    body: JSON.stringify({ url: 'https://ismyinternetworking.com/' }),
  });
  if (res.ok) {
    return true;
  }
  return await Promise.reject(`status code: ${res.status}`);
}

export default doAuth;
