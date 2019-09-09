import { axios } from '@/plugins/axios'
import { createSummonerData } from '@/helpers/summoner'

export const namespaced = true

export const state = {
  infos: [],
  loading: false,
  summonerFound: false
}

export const mutations = {
  SUMMONER_REQUEST(state) {
    state.loading = true
  },
  SUMMONER_FOUND(state, infos) {
    state.summonerFound = true
    state.loading = false
    state.infos = infos
  },
  SUMMONER_NOT_FOUND(state) {
    state.summonerFound = false
    state.loading = false
  }
}

export const actions = {
  async summonerRequest({ commit, dispatch, rootState }, { summoner, region }) {
    console.log(summoner, region)
    region = rootState.regionsList[region]
    commit('SUMMONER_REQUEST')
    try {
      const resp = await axios(({ url: 'api', data: { summoner, region }, method: 'POST' }))
      if (resp.data) {
        const infos = createSummonerData(resp.data, rootState.ddragon.champions)
        commit('SUMMONER_FOUND', infos)
      } else {
        commit('SUMMONER_NOT_FOUND')

        dispatch('notification/add', {
          type: 'error',
          message: 'Summoner not found.'
        }, { root: true })
        console.log('Summoner not found - store')
      }
    } catch (error) {
      commit('SUMMONER_NOT_FOUND')
      console.log(error)
    }
  }
}
