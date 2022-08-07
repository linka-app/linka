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
    if (k === "token" || k === "url") {
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
  if (res.status === 200) {
    return res.json();
  }
  return await Promise.reject(`status code: ${res.status}`);
}

export { getBookmarks };
