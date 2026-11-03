import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { target: ['chrome111', 'safari16.4', 'firefox128'] },
  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src`,
    },
  },
})
