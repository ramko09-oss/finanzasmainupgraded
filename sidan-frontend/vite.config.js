import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    manifest: 'manifest.json',
    rollupOptions: { preserveEntrySignatures: 'strict', input: {
      app: fileURLToPath(new URL('./index.html', import.meta.url)),
      dashboard: fileURLToPath(new URL('./src/dashboard.jsx', import.meta.url)),
    } },
  },
  server: { proxy: { '/api': 'http://localhost:3001' } },
})
