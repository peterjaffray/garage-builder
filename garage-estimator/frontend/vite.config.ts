import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
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
})
