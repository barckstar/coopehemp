// Deploy: en Vercel, Root Directory = "frontend" (buildea solo el front, no el backend del monorepo).
// Env vars en Vercel: VITE_MEDUSA_URL (túnel ngrok del backend) + VITE_MEDUSA_PUBLISHABLE_KEY.
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const medusaUrl = env.VITE_MEDUSA_URL || 'http://localhost:9000'

  return {
    plugins: [react()],
    build: {
      target: 'es2020',
      // Separar vendors pesados en chunks propios → mejor cacheo y carga inicial más liviana.
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('framer-motion')) return 'framer';
              if (id.includes('react-router') || id.includes('@remix-run')) return 'router';
              if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'react';
              // El resto (leaflet, react-markdown, etc.) lo deja Vite por ruta:
              // así Leaflet queda en el chunk lazy de /mapa y markdown en el de Post,
              // sin cargar eager en el home.
            }
          },
        },
      },
    },
    server: {
      // Permitir el host del túnel (cloudflared) para demos públicas
      allowedHosts: ['.trycloudflare.com'],
      proxy: {
        // Proxy /store/* and /admin/* to Medusa (avoids CORS in dev)
        '/store': { target: medusaUrl, changeOrigin: true },
        '/admin': { target: medusaUrl, changeOrigin: true },
      },
    },
  }
})
