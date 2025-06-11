// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: {enabled: true},
    modules: [
      '@nuxt/fonts',
      '@nuxt/icon',
      '@nuxt/image',
      '@nuxt/scripts',
      '@nuxt/ui',
      '@nuxt/eslint',
      '@nuxtjs/i18n',
      '@pinia/nuxt'
    ],
    css: ['~/assets/css/main.css'],
    i18n: {
        locales: [
            {
                code: 'en',
                name: 'English',
                file: 'en.json'
            }
        ],
        defaultLocale: 'en',
    },
    pinia: {
        storesDirs: ['./stores/**'],
    }
})