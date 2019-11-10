import Vue from 'vue'
import VueAxios from './plugins/axios'

import '@/assets/css/main.css'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueAxios)

Vue.filter('capitalize', (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
})

Vue.filter('secToTime', (sec) => {
  const min = Math.floor(sec / 60)
  const newSec = sec - min * 60
  return min + 'm' + (newSec < 10 ? '0' + newSec : newSec) + 's'
})

Vue.filter('percent', (value) => {
  return `${+value.toFixed(2)}%`
})

Vue.filter('round', (value) => {
  return `${+value.toFixed(2)}`
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
