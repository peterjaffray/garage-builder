import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    base: env.VITE_BASE_URL || '/',
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://api:3000',
          changeOrigin: true
        }
      }
    }
  }
})
