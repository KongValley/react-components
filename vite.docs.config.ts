import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: fileURLToPath(new URL('./docs', import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@lib$/,
        replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      },
      {
        find: /^@lib\//,
        replacement: `${fileURLToPath(new URL('./src', import.meta.url))}/`,
      },
    ],
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
  build: {
    outDir: fileURLToPath(new URL('./dist-docs', import.meta.url)),
    emptyOutDir: true,
  },
});
