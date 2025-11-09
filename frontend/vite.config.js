import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  envDir: '..',
  plugins: [tailwindcss(), react()],
  server: {
    port: 8000,
    fs: {
      allow: [path.resolve(__dirname, '..')]
    }
  },
  resolve: {
    alias: {}
  },
  theme: {
    extend: {
      colors: {
        primary: '5f6FFF'
      }
    }
  }
})
