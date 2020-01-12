import Vue from 'vue'
import Router from 'vue-router'
import { axios } from './plugins/axios'

import Home from '@/views/Home.vue'
import Summoner from '@/views/Summoner.vue'
import SummonerChampions from '@/views/SummonerChampions.vue'
import SummonerRecords from '@/views/SummonerRecords.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
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
      component: Summoner
    },
    {
      path: '/summoner/:region/:name/champions',
      name: 'summonerChampions',
      component: SummonerChampions
    },
    {
      path: '/summoner/:region/:name/records',
      name: 'summonerRecords',
      component: SummonerRecords
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