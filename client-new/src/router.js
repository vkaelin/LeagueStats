import Vue from 'vue'
import Router from 'vue-router'
import { axios } from './plugins/axios'

import Home from '@/views/Home.vue'
import Summoner from '@/views/Summoner.vue'
import SummonerChampions from '@/views/SummonerChampions.vue'
import SummonerLive from '@/views/SummonerLive.vue'
import SummonerRecords from '@/views/SummonerRecords.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        layout: 'Home'
      }
    },
    {
      path: '/summoner/:region/:name',
      name: 'summoner',
      component: Summoner,
      meta: {
        season: true
      }
    },
    {
      path: '/summoner/:region/:name/champions',
      name: 'summonerChampions',
      component: SummonerChampions,
      meta: {
        season: true
      }
    },
    {
      path: '/summoner/:region/:name/records',
      name: 'summonerRecords',
      component: SummonerRecords,
      meta: {
        season: true
      }
    },
    {
      path: '/summoner/:region/:name/live',
      name: 'summonerLive',
      component: SummonerLive
    },
  ]
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