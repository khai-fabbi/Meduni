// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "nuxt-og-image",
    "@nuxt/fonts",
    "nuxt-svgo",
    "@nuxt/scripts",
  ],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  routeRules: {
    "/docs": { redirect: "/docs/getting-started", prerender: false },
  },

  compatibilityDate: "2024-07-11",

  nitro: {
    prerender: {
      routes: ["/"],
      crawlLinks: true,
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
  fonts: {
    families: [
      {
        name: "Inter",
        provider: "google",
        weights: [400, 500, 600, 700, 800],
        subsets: ["latin", "vietnamese"],
        display: "swap",
        fallbacks: ["sans-serif"],
      },
    ],
  },
  svgo: {
    autoImportPath: "~/assets/icons/**/*.svg",
    defaultImport: "component",
    global: true,
    componentPrefix: "i",
  },
  scripts: {
    enabled: true,
  },
});
