import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    manifest: 'manifest.json',
  },
  server: { proxy: { '/api': 'http://localhost:3001', '/img': 'http://localhost:3001' } },
})
