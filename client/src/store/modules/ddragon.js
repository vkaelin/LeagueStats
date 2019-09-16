import { axios } from '@/plugins/axios'

export const namespaced = true

export const state = {
  champions: [],
  runes: []
}

export const mutations = {
  PUSH_CHAMPIONS(state, champions) {
    state.champions = champions
  },
  PUSH_RUNES(state, runes) {
    state.runes = runes
  }
}

export const actions = {
  async getChampions({ commit }) {
    console.log('API CALL FOR CHAMPIONS')
    const endpoint = 'Champion'
    const resp = await axios(({ url: 'ddragon', data: { endpoint }, method: 'POST' }))
    commit('PUSH_CHAMPIONS', resp.data.data)
  },

  async getRunes({ commit }) {
    console.log('API CALL FOR RUNES')
    const endpoint = 'Rune'
    const resp = await axios(({ url: 'ddragon', data: { endpoint }, method: 'POST' }))
    commit('PUSH_RUNES', resp.data)
  },
}

export const getters = {
  areChampionsLoaded: state => !!state.champions.Aatrox
}
