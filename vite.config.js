import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VitePWA({
      injectRegister: 'auto',
      workbox: {
        cleanupOutdatedCaches: false,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}']
      },
      manifest: {
        name: 'Yconnect',
        short_name: 'Yconnect',
        icons: [
          {
            src: 'icons/192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        scope: '/',
        orientation: 'portrait'
      }
    })
  ],
  server: {
    port: 80
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  publicRuntimeConfig: {
    // variables used at runtime
    apiUrl: {
      main: 'http://yconnect-api.codemates.fr/api'
    },
    apiLocales: ['fr', 'en', 'es', 'de', 'it', 'pt'] // languages handled in i18n attributes
  },
  build: {
    manifest: true
  }
})
