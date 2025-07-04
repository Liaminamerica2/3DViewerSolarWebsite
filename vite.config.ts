// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this property to fix the 'global is not defined' error
  define: {
    global: 'globalThis',
  },
})