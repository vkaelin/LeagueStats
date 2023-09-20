import Plausible from 'plausible-tracker'

export default {
  install(Vue) {
    const options = {
      domain: 'leaguestats.gg',
      trackLocalhost: false,
      apiHost: 'https://stats.leaguestats.gg',
    }
    const plausible = Plausible(options)
    plausible.enableAutoPageviews()

    Vue.prototype.$plausible = plausible
  },
}
