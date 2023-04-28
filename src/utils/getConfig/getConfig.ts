import { LinkaSettings } from '@/types';
import _ from 'lodash';

function getConfig(): LinkaSettings {
  const configObject = _.merge(
    {
      token: null,
      url: null,
      language: 'en',
      theme: 'light',
      openaiToken: null,
      browserlessToken: null,
      showBookmarkAvatar: true,
    },
    localStorage.getItem('linkaConfig') != null
      ? JSON.parse(localStorage.getItem('linkaConfig') as string)
      : {}
  ) as LinkaSettings;

  return configObject;
}

export { getConfig };
