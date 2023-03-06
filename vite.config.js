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
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['@/assets/style/variables.scss'],
    defaultAssets: {
      font: {
        family: 'Poppins',
      },
      icons: 'mdi',
      // see default icons presets at
      // https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/services/icons/presets/mdi.ts
    },
    lang: {
      current: 'fr',
    },
    theme: {
      dark: false,
      options: {
        customProperties: true,
      },
      themes: {
        light: {
          ynov: '#23b2a4',
          info: '#1b9dd9',
          warning: '#ff730f', // pumpkin-orange
          error: '#e72121', // vermillon
          success: '#6cc021', // apple green
          // custom colors
          alto: '#d5d5d5',
          avocado: '#96c337',
          strawberry: '#ff242f',
          vermillion: '#e72121',
        },
      },
    },
    treeShake: true,
  },
  
})
