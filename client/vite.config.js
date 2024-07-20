import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://edu-master-seven.vercel.app/', // Replace this with your backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
