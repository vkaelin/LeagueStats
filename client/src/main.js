import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import '@/assets/css/tailwind.css'

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
