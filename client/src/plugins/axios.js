import axiosHttp from 'axios'
import router from '../router'
import store from '../store'

export const axios = axiosHttp

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3333/' : 'https://api.leaguestats.gg/'

const CancelToken = axios.CancelToken
const axiosSource = CancelToken.source()
axios.defaults.axiosSource = axiosSource
axios.defaults.cancelToken = axiosSource.token

// Add season number to data if the route need it
axios.interceptors.request.use(function (config) {
  if (config.method === 'post' && config.url !== 'summoner/basic' && router.currentRoute.meta.season) {
    config.data.season = store.state.summoner.basic.currentSeason
  }
  return config
})

export default {
  install(Vue) {
    Vue.prototype.$axios = axiosHttp
  }
}
