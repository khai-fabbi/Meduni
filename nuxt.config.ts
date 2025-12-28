// https://nuxt.com/docs/api/configuration/nuxt-config

import { vite as vidstack } from 'vidstack/plugins'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-og-image',
    '@nuxt/fonts',
    'nuxt-svgo',
    '@nuxt/scripts',
    'pinia-plugin-persistedstate/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('media-')
    }
  },
  colorMode: {
    preference: 'light',
    fallback: 'light'
  },
  runtimeConfig: {
    public: {
      // Environment
      nodeEnv: process.env.NUXT_PUBLIC_NODE_ENV || 'local',
      // base url
      apiUrl: process.env.NUXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080',
      s3Bucket: process.env.NUXT_PUBLIC_S3_BUCKET || 'ai-elearning-user',
      apiSearchEndpoint: process.env.NUXT_PUBLIC_API_SEARCH_ENDPOINT,
      awsAppsyncEndpoint: process.env.NUXT_PUBLIC_AWS_APPSYNC_ENDPOINT,
      awsAppsyncApiKey: process.env.NUXT_PUBLIC_AWS_APPSYNC_APIKEY,
      appAssetEndpoint: process.env.NUXT_PUBLIC_APP_ASSET_ENDPOINT,
      appFlagCdn: process.env.NUXT_PUBLIC_APP_FLAG_CDN,

      // Gemini
      geminiApiKey: process.env.NUXT_PUBLIC_GEMINI_API_KEY,
      geminiApiUrl: process.env.NUXT_PUBLIC_GEMINI_API_URL,

      // CES Intelligent
      beCesintelligentUrl: process.env.NUXT_PUBLIC_BE_CESINTELLIGENT_URL,
      beCesintelligentApiKey: process.env.NUXT_PUBLIC_BE_CESINTELLIGENT_API_KEY
    }
  },

  routeRules: {},

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: ['/gioi-thieu'],
      crawlLinks: true
    }
  },
  vite: {
    plugins: [vidstack()]
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  fonts: {
    families: [
      {
        name: 'Inter',
        provider: 'google',
        weights: [400, 500, 600, 700, 800],
        subsets: ['latin', 'vietnamese'],
        display: 'swap',
        fallbacks: ['sans-serif']
      }
    ]
  },
  scripts: {
    enabled: true
  },
  svgo: {
    autoImportPath: '~/assets/icons/**/*.svg',
    defaultImport: 'component',
    global: true,
    componentPrefix: 'i'
  }
})
