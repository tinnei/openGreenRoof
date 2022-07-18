import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@root': path.resolve(__dirname, './'),
      '@public': path.resolve(__dirname, './public'),
      '@cypress': path.resolve(__dirname, './cypress'),
      '@dist': path.resolve(__dirname, './dist'),
    },
  }
})
