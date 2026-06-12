import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const medusaUrl = env.VITE_MEDUSA_URL || 'http://localhost:9000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy /store/* and /admin/* to Medusa (avoids CORS in dev)
        '/store': { target: medusaUrl, changeOrigin: true },
        '/admin': { target: medusaUrl, changeOrigin: true },
      },
    },
  }
})
