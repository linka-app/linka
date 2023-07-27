import { open } from '@tauri-apps/api/shell';

export const openURLInDefaultBrowser = (url: string) => {
  // default
  window.open(url, '_blank');
  // tauri
  if (Object.hasOwn(window, '__TAURI__')) {
    open(url)
      .then((res) => {
        console.log('res:', res);
      })
      .catch((e) => {
        console.error('e', e);
      });
  }
};
