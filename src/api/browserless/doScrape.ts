import { getConfig } from '@/utils/getConfig/getConfig';
import _ from 'lodash';

export async function doScrape(args: { url: string }) {
  const config = getConfig();

  if (config.browserlessToken) {
    const endpoint = `https://chrome.browserless.io/scrape`;
    let url = new URL(endpoint);
    url.searchParams.append('token', config.browserlessToken);
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
            selector: 'title,meta[name="description"],h1,p,h2,h3,main ul',
          },
        ],
      }),
    });

    if (res.ok) {
      return await res.json().then((data) => {
        const theReturn: string[] = [];
        _.get(data, 'data.0.results', []).forEach(
          (result: {
            html: string;
            text?: string;
            attributes?: { name: string; value: string };
          }) => {
            if (result.text) {
              const text = result.text.trim().replace(/(^[ \t]*\n)/gm, '');
              if (text.length > 0) {
                theReturn.push(text);
              }
            } else {
              if (result.attributes) {
                _.forEach(
                  result.attributes,
                  (attribute: { name: string; value: string }) => {
                    if (attribute.name === 'content') {
                      const text = attribute.value.replace(/(^[ \t]*\n)/gm, '');
                      if (text.length > 0) {
                        theReturn.push(text);
                      }
                    }
                  }
                );
              }
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
