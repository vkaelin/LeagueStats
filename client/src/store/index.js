import Vue from 'vue'
import Vuex from 'vuex'
import * as ddragon from '@/store/modules/ddragon'
import * as detailedMatch from '@/store/modules/detailedMatch'
import * as notification from '@/store/modules/notification'
import * as settings from '@/store/modules/settings'
import * as summoner from '@/store/modules/summoner'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    ddragon,
    detailedMatch,
    notification,
    settings,
    summoner
  },
  state: {
    currentRegion: 'euw1',
    regionsList: {
      'br': 'br1',
      'eune': 'eun1',
      'euw': 'euw1',
      'jp': 'jp1',
      'kr': 'kr',
      'lan': 'la1',
      'las': 'la2',
      'na': 'na1',
      'oce': 'oc1',
      'tr': 'tr1',
      'ru': 'ru'
    },
    roles: ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']
  },
  mutations: {
    UPDATE_REGION(state, newRegion) {
      state.currentRegion = state.regionsList[newRegion]
    }
  },
  actions: {
    updateCurrentRegion({ commit }, newRegion) {
      commit('UPDATE_REGION', newRegion)
    }
  },
  strict: debug
})
