require('dotenv').config();

module.exports = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'pl-reversi',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  env: {
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
    DATABASE_URL: process.env.DATABASE_URL,
  },

  css: ['~/assets/reset.css', '~/assets/style.scss'],

  plugins: [],

  components: true,

  buildModules: ['@nuxt/typescript-build'],

  modules: ['@nuxtjs/axios', 'nuxt-webfontloader', '@nuxtjs/style-resources'],

  styleResources: {
    scss: ['~/assets/_mixin.scss'],
  },

  webfontloader: {
    google: {
      families: ['DotGothic16'],
    },
  },

  axios: {
    baseURL: '/',
  },
};
