import { axios } from '@/plugins/axios'

export const namespaced = true

export const state = {
  kStats: [
    [5008, 5005, 5007],
    [5008, 5002, 5003],
    [5001, 5002, 5003],
  ],
  runes: null,
  runesOpen: false,
  selectedRunes: {},
}

export const mutations = {
  DISPLAY_HIDE_RUNES(state, selectedRunes) {
    state.runesOpen = !state.runesOpen
    state.selectedRunes = selectedRunes
  },
  SET_RUNES(state, runes) {
    state.runes = runes
  },
}

export const actions = {
  displayOrHideRunes({ commit }, selectedRunes) {
    commit('DISPLAY_HIDE_RUNES', selectedRunes)
  },
  async getRunes({ commit, getters }) {
    if (getters.runesLoaded) {
      return
    }

    const { data } = await axios.get('cdragon/runes').catch((e) => {
      console.log(e)
    })
    console.log(data)
    commit('SET_RUNES', data)
  },
}

export const getters = {
  runesLoaded: (state) => state.runes,
}
