import Vue from 'vue'
import { axios } from '@/plugins/axios'

export const namespaced = true

export const state = {
  matches: []
}

export const mutations = {
  MATCH_LOADING(state, matchId) {
    const alreadyIn = state.matches.find(m => m.matchId === matchId)
    if (!alreadyIn) {
      state.matches.push({ matchId, status: 'loading' })
    }
  },
  MATCH_FOUND(state, {matchDetails, ranksLoaded }) {
    matchDetails.status = 'loaded'
    matchDetails.ranksLoaded = ranksLoaded

    // Set SoloQ as rank for now
    if (ranksLoaded) {
      for (const player of matchDetails.blueTeam.players) {
        player.rank = player.rank && player.rank[420]
      }
      for (const player of matchDetails.redTeam.players) {
        player.rank = player.rank && player.rank[420]
      }
    }

    const index = state.matches.findIndex(m => m.matchId === matchDetails.matchId)
    Vue.set(state.matches, index, matchDetails)
  },
  MATCH_RANKS_FOUND(state, { matchId, ranksByPlayer }) {
    const match = state.matches.find(m => m.matchId === matchId)

    for (const player of match.blueTeam.players) {
      const ranks = ranksByPlayer[player.id]
      if (!ranks) continue
      Vue.set(player, 'rank', ranks[420])
    }

    for (const player of match.redTeam.players) {
      const ranks = ranksByPlayer[player.id]
      if (!ranks) continue
      Vue.set(player, 'rank', ranks[420]) 
    }

    match.ranksLoaded = true
  },
}

export const actions = {
  async matchDetails({ commit }, matchId) {
    commit('MATCH_LOADING', matchId)
    console.log('MATCH DETAILS STORE', matchId)

    const resp = await axios(({ url: 'match/details', data: { matchId }, method: 'POST' })).catch(() => { })
    console.log('--- DETAILS INFOS ---')
    console.log(resp.data)
    const {matchDetails, ranksLoaded} = resp.data
    commit('MATCH_FOUND',  {matchDetails, ranksLoaded })

    // If the ranks of the players are not yet known
    if (!ranksLoaded) {
      const ranks = await axios(({ url: 'match/details/ranks', data: { matchId }, method: 'POST' })).catch(() => { })
      if (!ranks) return
      console.log('--- RANK OF MATCH DETAILS ---')
      console.log(ranks.data)
      commit('MATCH_RANKS_FOUND', { matchId, ranksByPlayer: ranks.data })
    }
  }
}

export const getters = {
  getMatchDetails: state => matchId => state.matches.find(m => m.matchId === matchId),
}
