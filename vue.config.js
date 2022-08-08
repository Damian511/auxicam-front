const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
  ? '/auxicam/'
  : '/',
  pwa: {
    name: 'Auxicam',
    themeColor: '#78909C'
  },
  transpileDependencies: [
    'vuetify'
  ],
})
