import Vue from 'vue'
import Vuex from 'vuex'
import * as cdragon from '@/store/modules/cdragon'
import * as detailedMatch from '@/store/modules/detailedMatch'
import * as notification from '@/store/modules/notification'
import * as settings from '@/store/modules/settings'
import * as summoner from '@/store/modules/summoner'

Vue.use(Vuex)

const debug = import.meta.env.DEV

export default new Vuex.Store({
  modules: {
    cdragon,
    detailedMatch,
    notification,
    settings,
    summoner
  },
  state: {
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
      'ru': 'ru',
      'ph': 'ph2',
      'sg': 'sg2',
      'th': 'th2',
      'tw': 'tw2',
      'vn': 'vn2',
    },
    roles: ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY']
  },
  strict: debug
})
