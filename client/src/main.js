import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import '@/assets/css/tailwind.css'
import 'vue-awesome/icons'

import App from './App.vue'
import router from './router'
import Icon from 'vue-awesome/components/Icon'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.component('v-icon', Icon)


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
