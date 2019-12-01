import Vue from 'vue'
import { axios } from '@/plugins/axios'

export const namespaced = true

export const state = {
  matches: []
}

export const mutations = {
  MATCHE_LOADING(state, gameId) {
    const alreadyIn = state.matches.find(m => m.gameId === gameId)
    if (!alreadyIn) {
      state.matches.push({ gameId: gameId, status: 'loading' })
    }
  },
  MATCHE_FOUND(state, matchDetails) {
    matchDetails.status = 'loaded'

    const index = state.matches.findIndex(m => m.gameId === matchDetails.gameId)
    Vue.set(state.matches, index, matchDetails)
  },
  MATCHE_RANKS_FOUND(state, { gameId, blueTeam, redTeam }) {
    const match = state.matches.find(m => m.gameId === gameId)
    match.blueTeam.players = blueTeam
    match.redTeam.players = redTeam
  },
}

export const actions = {
  async matchDetails({ commit, rootState }, gameId) {
    commit('MATCHE_LOADING', gameId)
    console.log('MATCH DETAILS STORE', gameId, rootState.currentRegion)

    const resp = await axios(({ url: 'match-details', data: { gameId, region: rootState.currentRegion }, method: 'POST' })).catch(() => { })
    console.log('--- DETAILS INFOS ---')
    console.log(resp.data)
    // const detailedMatch = createDetailedMatchData(resp.data.matchDetails)
    commit('MATCHE_FOUND', resp.data.matchDetails)

    // If the ranks of the players are not yet known
    if (resp.data.matchDetails.blueTeam.players[0].rank === undefined) {
      const ranks = await axios(({ url: 'match-details-ranks', data: { gameId, region: rootState.currentRegion }, method: 'POST' })).catch(() => { })
      console.log('--- RANK OF MATCH DETAILS ---')
      console.log(ranks.data)
      commit('MATCHE_RANKS_FOUND', { gameId, ...ranks.data })
    }
  }
}

export const getters = {
  getMatchDetails: state => gameId => state.matches.find(m => m.gameId === gameId),
}
