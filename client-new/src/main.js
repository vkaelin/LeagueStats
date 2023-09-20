import Vue from 'vue'
import VueAxios from './plugins/axios'
import VueMeta from 'vue-meta'
import VuePlausible from './plugins/plausible'
import PortalVue from 'portal-vue'

import './assets/css/main.css'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueAxios)
Vue.use(VuePlausible)
Vue.use(VueMeta)
Vue.use(PortalVue)

Vue.filter('capitalize', (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
})

Vue.filter('kilo', (value, shortFormat = true) => {
  return value > 1000 || shortFormat ? `${+(value / 1000).toFixed(1)}k` : value
})

Vue.filter('secToTime', (sec, dotNotation = false) => {
  if (isNaN(sec)) return 0

  const min = Math.floor(sec / 60)
  let newSec = Math.floor(sec - min * 60)
  newSec = newSec < 10 ? '0' + newSec : newSec

  return dotNotation ? `${min}:${newSec}` : `${min}m${newSec}s`
})

Vue.filter('secToHours', (sec) => {
  if (isNaN(sec)) return 0

  const result = []
  const d = Math.floor(sec / (3600 * 24))
  const h = Math.floor((sec % (3600 * 24)) / 3600)
  const m = Math.floor((sec % 3600) / 60)

  if (d > 0) {
    result.push(d + ' days')
  } else {
    if (h > 0) {
      result.push(h + 'h')
    }

    if (m > 0) {
      result.push(m + 'm')
    }
  }

  return result.join(' ')
})

Vue.filter('percent', (value) => {
  return `${+value.toFixed(1)}%`
})

Vue.filter('round', (value, decimals = 2) => {
  if (isNaN(value)) return 0

  return parseFloat(value.toFixed(decimals))
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
