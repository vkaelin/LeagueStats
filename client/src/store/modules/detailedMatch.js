import Vue from 'vue'
import { axios } from '@/plugins/axios'

export const namespaced = true

export const state = {
  matches: []
}

export const mutations = {
  MATCH_LOADING(state, gameId) {
    const alreadyIn = state.matches.find(m => m.gameId === gameId)
    if (!alreadyIn) {
      state.matches.push({ gameId: gameId, status: 'loading' })
    }
  },
  MATCH_FOUND(state, matchDetails) {
    matchDetails.status = 'loaded'

    const index = state.matches.findIndex(m => m.gameId === matchDetails.gameId)
    Vue.set(state.matches, index, matchDetails)
  },
  MATCH_RANKS_FOUND(state, { gameId, blueTeam, redTeam }) {
    const match = state.matches.find(m => m.gameId === gameId)
    match.blueTeam.players = blueTeam
    match.redTeam.players = redTeam
  },
}

export const actions = {
  async matchDetails({ commit, rootState }, gameId) {
    commit('MATCH_LOADING', gameId)
    const region = rootState.regionsList[rootState.settings.region]
    console.log('MATCH DETAILS STORE', gameId, region)

    const resp = await axios(({ url: 'match/details', data: { gameId, region }, method: 'POST' })).catch(() => { })
    console.log('--- DETAILS INFOS ---')
    console.log(resp.data)
    commit('MATCH_FOUND', resp.data.matchDetails)

    // If the ranks of the players are not yet known
    if (resp.data.matchDetails.blueTeam.players[0].rank === undefined) {
      const ranks = await axios(({ url: 'match/details/ranks', data: { gameId, region }, method: 'POST' })).catch(() => { })
      if (!ranks) return
      console.log('--- RANK OF MATCH DETAILS ---')
      console.log(ranks.data)
      commit('MATCH_RANKS_FOUND', { gameId, ...ranks.data })
    }
  }
}

export const getters = {
  getMatchDetails: state => gameId => state.matches.find(m => m.gameId === gameId),
}
