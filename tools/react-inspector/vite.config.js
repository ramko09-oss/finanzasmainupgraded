import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { include: ['react-is'] },
  server: {
    proxy: { '/api': 'http://127.0.0.1:3002', '/img': 'http://127.0.0.1:3002' },
  },
})
