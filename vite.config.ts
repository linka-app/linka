import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    VitePWA({
      manifest: {
        name: 'Linka! Quick search and open your bookmarks!',
        short_name: 'Linka!',
        theme_color: '#00000000',
        icons: [
          {
            src: '/public/logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
