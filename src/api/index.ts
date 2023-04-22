import { BookmarkItem } from '../types';
import { getAuth } from '../utils/getAuth';

type queryBookmarkArgs = {
  q?: string;
  limit?: number;
  offset?: number;
};

async function getBookmarks(args: queryBookmarkArgs) {
  const auth = getAuth();
  if (auth) {
    const endpoint = `${auth.url}/api/bookmarks`;
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

type doArgs = {
  id: number;
};

async function getBookmark(args: doArgs) {
  const auth = getAuth();
  if (auth) {
    const endpoint = `${auth.url}/api/bookmarks/${args.id}/`;
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

async function getTags() {
  const auth = getAuth();
  if (auth) {
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

async function doArchive(args: doArgs) {
  const auth = getAuth();
  if (auth) {
    const endpoint = `${auth.url}/api/bookmarks/${args.id}/archive/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${auth.token}`,
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

async function doDelete(args: doArgs) {
  const auth = getAuth();
  if (auth) {
    const endpoint = `${auth.url}/api/bookmarks/${args.id}/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${auth.token}`,
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

async function doShare(args: doArgs) {
  const auth = getAuth();
  if (auth) {
    const endpoint = `${auth.url}/api/bookmarks/${args.id}/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${auth.token}`,
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

type bookmarkArgs = {
  id: number;
  payload: BookmarkItem;
};

async function doUpdate(args: bookmarkArgs) {
  const auth = getAuth();

  if (auth) {
    const endpoint = `${auth.url}/api/bookmarks/${args.id}/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Token ${auth.token}`,
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

async function doCreate(args: Omit<bookmarkArgs, 'id'>) {
  const auth = getAuth();

  if (auth) {
    const endpoint = `${auth.url}/api/bookmarks/`;
    let url = new URL(endpoint);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${auth.token}`,
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

export {
  getBookmark,
  getBookmarks,
  doArchive,
  doDelete,
  doShare,
  getTags,
  doUpdate,
  doCreate,
};
