import { defineConfig, loadEnv } from "@medusajs/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      storeCors: process.env.STORE_CORS!,
      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL!,
  },
  modules: [
    {
      resolve: "./src/modules/blog",
    },
    {
      resolve: "./src/modules/newsletter",
    },
  ],
})
