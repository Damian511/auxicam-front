const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pwa: {
    name: 'Auxicam',
    themeColor: '#78909C'
  },
  transpileDependencies: [
    'vuetify'
  ],
})
