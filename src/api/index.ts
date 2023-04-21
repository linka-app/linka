type queryBookmarkArgs = {
  token: string;
  url: string;

  q?: string;
  limit?: number;
  offset?: number;
};

async function getBookmarks(args: queryBookmarkArgs) {
  const endpoint = `${args.url}/api/bookmarks`;
  let url = new URL(endpoint);
  Object.entries(args).forEach(([k, v], idx) => {
    if (k === 'token' || k === 'url') {
      return;
    }
    if (v !== undefined) {
      url.searchParams.append(k, v.toString());
    }
  });
  const res = await fetch(url, {
    headers: {
      Authorization: `Token ${args.token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  return await Promise.reject(`status code: ${res.status}`);
}

type doArgs = {
  token: string;
  url: string;
  id: number;
};

async function doArchive(args: doArgs) {
  const endpoint = `${args.url}/api/bookmarks/${args.id}/archive/`;
  let url = new URL(endpoint);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${args.token}`,
    },
  });
  if (res.ok) {
    return true;
  }
  return await Promise.reject(`status code: ${res.status}`);
}

async function doDelete(args: doArgs) {
  const endpoint = `${args.url}/api/bookmarks/${args.id}/`;
  let url = new URL(endpoint);

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${args.token}`,
    },
  });
  if (res.ok) {
    return true;
  }
  return await Promise.reject(`status code: ${res.status}`);
}

async function doShare(args: doArgs) {
  const endpoint = `${args.url}/api/bookmarks/${args.id}/`;
  let url = new URL(endpoint);

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Token ${args.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shared: true }),
  });
  console.log(res);
  if (res.ok) {
    return true;
  }
  return await Promise.reject(`status code: ${res.status}`);
}

export { getBookmarks, doArchive, doDelete, doShare };
