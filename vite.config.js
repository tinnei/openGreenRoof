import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'path'
import { readdirSync } from 'fs'

const absolutePathAliases: { [key: string]: string } = {};
// Root resources folder
const srcPath = path.resolve('./resources/');
// Ajust the regex here to include .vue, .js, .jsx, etc.. files from the resources/ folder
const srcRootContent = readdirSync(srcPath, { withFileTypes: true }).map((dirent) => dirent.name.replace(/(\.jsx){1}(x?)/, ''));

srcRootContent.forEach((directory) => {
  absolutePathAliases[directory] = path.join(srcPath, directory);
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src',
  resolve: {
    alias: {
      ...absolutePathAliases
    }
  },

  build: {
    rollupOptions: {
      input: '/main.jsx'
    }
  }
})
