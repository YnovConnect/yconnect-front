import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  publicRuntimeConfig: {
    // variables used at runtime
    apiUrl: {
      main: 'http://yconnect-api.codemates.fr/api',
    },
    apiLocales: ['fr', 'en', 'es', 'de', 'it', 'pt'], // languages handled in i18n attributes
  },
})
