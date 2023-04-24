import _ from 'lodash';
import { LinkaPartialSettings, LinkaSettings } from '../types';
import { getConfig } from './getConfig';

function setConfig(config: LinkaPartialSettings): void {
  const currentConfig = getConfig();
  const configObject = _.merge(currentConfig, config) as LinkaSettings;
  localStorage.setItem('linkaConfig', JSON.stringify(configObject));
}

export { setConfig };
