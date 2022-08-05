import axios from "axios";

const BASE_URL = "https://link.unoiou.com/api"

type queryBookmarkArgs = {
    q?: string;
    limit?: number;
    offset?: number;
}

function getBookmarks(args: queryBookmarkArgs) {
    const endpoint = `${BASE_URL}/bookmarks`
    let url = new URL(endpoint);
    Object.entries(args).forEach(([k, v], idx) => {
        if (v != undefined) {
            url.searchParams.append(k, v.toString())
        }
    })
    console.log("url:", url.toString())
    return axios.get(url.toString(), {
        headers: {
            'Authorization': 'Token 06e02bc8d76e727baf18ac233ed941859b0d54ee',
            'Access-Control-Allow-Origin': '*',
        }
    })
}

export {
    getBookmarks
}