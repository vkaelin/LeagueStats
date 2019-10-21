import Vue from 'vue'
import VueAxios from './plugins/axios'

import '@/assets/css/main.css'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'


import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueAxios)

Vue.component('v-icon', Icon)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
