import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://api.hto.edu.vn",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      },
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'spa-fallback-404',
      closeBundle() {
        const dist = resolve(import.meta.dirname, 'dist')
        const index = resolve(dist, 'index.html')
        const fallback = resolve(dist, '404.html')
        if (fs.existsSync(index)) {
          fs.copyFileSync(index, fallback)
        }
      },
    },
  ],
})