import _ from 'lodash';
import { LinkaSettings } from '@/types';

function getConfig(): LinkaSettings {
  const configObject = _.merge(
    {
      token: null,
      url: null,
      language: 'en',
      theme: 'light',
      openaiToken: null,
      browserlessToken: null,
    },
    localStorage.getItem('linkaConfig') != null
      ? JSON.parse(localStorage.getItem('linkaConfig') as string)
      : {}
  ) as LinkaSettings;

  //!TODO: remove this as it is now depricated for the LinkaConfig Object but it preserves legacy settings
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
      localStorage.getItem('openaiToken') != null
        ? localStorage.getItem('openaiToken')
        : undefined,
    browserlessToken:
      localStorage.getItem('browserlessToken') != null
        ? localStorage.getItem('browserlessToken')
        : undefined,
  } as LinkaSettings;

  if (authObject.token && !configObject.token) {
    configObject.token = authObject.token;
  }
  if (authObject.url && !configObject.url) {
    configObject.url = authObject.url;
  }
  if (authObject.openaiToken && !configObject.openaiToken) {
    configObject.openaiToken = authObject.openaiToken;
  }
  if (authObject.browserlessToken && !configObject.browserlessToken) {
    configObject.browserlessToken = authObject.browserlessToken;
  }

  return configObject;
}

export { getConfig };
