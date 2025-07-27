// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/Portfolio/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <- allows "@/components/..." to resolve to src/components/...
    },
  },
  plugins: [react()],
})
