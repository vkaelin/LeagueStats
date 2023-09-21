import Vue from 'vue'
import Router from 'vue-router'
import { axios } from './plugins/axios'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        layout: 'Home',
      },
    },
    {
      path: '/summoner/:region/:name',
      name: 'summoner',
      component: () => import('@/views/Summoner.vue'),
      meta: {
        season: true,
      },
    },
    {
      path: '/summoner/:region/:name/champions',
      name: 'summonerChampions',
      component: () => import('@/views/SummonerChampions.vue'),
      meta: {
        season: true,
      },
    },
    {
      path: '/summoner/:region/:name/records',
      name: 'summonerRecords',
      component: () => import('@/views/SummonerRecords.vue'),
      meta: {
        season: true,
      },
    },
    {
      path: '/summoner/:region/:name/live',
      name: 'summonerLive',
      component: () => import('@/views/SummonerLive.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.params.name !== from.params.name && from.name !== null) {
    // Cancel old requests
    const axiosCancel = axios.defaults.axiosSource.cancel
    axiosCancel('Summoner changed')

    // Update cancel token
    const CancelToken = axios.CancelToken
    const axiosSource = CancelToken.source()
    axios.defaults.axiosSource = axiosSource
    axios.defaults.cancelToken = axiosSource.token
  }
  next()
})

export default router
