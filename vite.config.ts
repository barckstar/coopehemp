import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /store/* and /admin/* to the local Medusa backend (avoids CORS in dev)
      '/store': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
})
