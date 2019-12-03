import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home.vue'
import Summoner from '@/views/Summoner.vue'
import SummonerChampions from '@/views/SummonerChampions.vue'

Vue.use(Router)

export default new Router({
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
  ]
})