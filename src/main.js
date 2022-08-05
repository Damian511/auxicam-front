import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import Maska from 'maska'


Vue.use(Maska)

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

/* import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
 */


Vue.config.productionTip = false


import Echo from 'laravel-echo';
import './registerServiceWorker'

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.VUE_APP_WEBSOCKETS_KEY,
    wsHost: process.env.VUE_APP_WEBSOCKETS_SERVER,
    wsPort: process.env.VUE_APP_WEBSOCKETS_PORT,
    forceTLS: false,
    disableStats: true
});


new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
