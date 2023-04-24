import en from '../i18n/en.json' assert { type: 'json' };
import zh_CN from '../i18n/zh_CN.json' assert { type: 'json' };

export enum I18nLocals {
  'en' = 'en',
  'zh_CN' = 'zh_CN',
}

export const i18n = {
  en,
  zh_CN,
};

export const I18N_CONFIG_ALIAS: { [key: string]: string[] } = {
  zh_CN: ['zh_CN', '简体中文', '中文', '简体'],
  en: ['en', 'English', 'english'],
};

export function getI18nLocal(value: string): string | boolean {
  for (const key in I18N_CONFIG_ALIAS) {
    const aliases = I18N_CONFIG_ALIAS[key];
    if (aliases.includes(value)) {
      return key;
    }
  }
  return false;
}
