import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',         // Vercel looks for this
    sourcemap: false,       // disable in prod to reduce bundle size
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 5173,
  },
})

