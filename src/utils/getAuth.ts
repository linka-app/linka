import { LinkaSettings } from '../types';

function getAuth(): LinkaSettings {
  const authObject = {
    token:
      localStorage.getItem('token') != null
        ? localStorage.getItem('token')
        : undefined,
    url:
      localStorage.getItem('url') != null
        ? localStorage.getItem('url')
        : undefined,
    openaiToken:
      localStorage.getItem('openai_token') != null
        ? localStorage.getItem('openai_token')
        : undefined,
    browserlessToken:
      localStorage.getItem('browserless_token') != null
        ? localStorage.getItem('browserless_token')
        : undefined,
  } as LinkaSettings;

  if (authObject.token && authObject.url) {
    return authObject;
  }

  return {
    token: null,
    url: null,
    openaiToken: null,
    browserlessToken: null,
  };
}

export { getAuth };
