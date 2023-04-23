import _ from 'lodash';
import { getAuth } from '../../utils/getAuth';

export async function doScrape(args: { url: string }) {
  const auth = getAuth();

  if (auth.browserlessToken) {
    const endpoint = `https://chrome.browserless.io/scrape`;
    let url = new URL(endpoint);
    url.searchParams.append('token', auth.browserlessToken);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Cache-Control': `no-cache`,
        'Content-Type': `application/json`,
      },
      body: JSON.stringify({
        url: args.url,
        elements: [
          {
            selector: 'h1, h2, h3, h4, h5, h6, p, code, ul',
          },
        ],
      }),
    });

    if (res.ok) {
      return await res.json().then((data) => {
        const theReturn: string[] = [];
        _.get(data, 'data.0.results', []).forEach(
          (result: { html: string; text: string }) => {
            const text = result.text.trim().replace(/(^[ \t]*\n)/gm, '');
            if (text.length > 0) {
              theReturn.push(text);
            }
          }
        );
        return theReturn.join('\n');
      });
    }
    return await Promise.reject(`status code: ${res.status}`);
  } else {
    return await Promise.reject(`no Browserless token found`);
  }
}

export default doScrape;
