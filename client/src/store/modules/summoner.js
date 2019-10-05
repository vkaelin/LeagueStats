import { axios } from '@/plugins/axios'
import { createMatchData, createSummonerData } from '@/helpers/summoner'

export const namespaced = true

export const state = {
  infos: {
    account: {},
    matchIndex: 0,
    matchList: [],
    matches: [],
    soloQ: {}
  },
  status: '',
}

export const mutations = {
  MATCHES_FOUND(state, newMatches) {
    state.infos.matches = [...state.infos.matches, ...newMatches]

    state.infos.matchIndex += newMatches.length
  },
  SUMMONER_REQUEST(state) {
    state.status = 'loading'
  },
  SUMMONER_FOUND(state, infos) {
    state.infos.account = infos.account
    state.infos.matchList = infos.matchList
    state.infos.matches = infos.matches
    state.infos.soloQ = infos.soloQ
    state.infos.matchIndex = infos.matches.length
    state.status = 'found'
  },
  SUMMONER_NOT_FOUND(state) {
    state.status = 'error'
  }
}

export const actions = {
  async moreMatches({ commit }) {
    const account = state.infos.account
    const gameIds = state.infos.matchList.slice(state.infos.matchIndex, state.infos.matchIndex + 10).map(({ gameId }) => gameId)

    const resp = await axios(({ url: 'match', data: { account, gameIds }, method: 'POST' })).catch(() => { })
    commit('MATCHES_FOUND', createMatchData(resp.data))
  },
  async summonerRequest({ commit, dispatch, rootState }, { summoner, region }) {
    region = rootState.regionsList[region]
    commit('SUMMONER_REQUEST')
    try {
      const resp = await axios(({ url: 'api', data: { summoner, region }, method: 'POST' }))
      if (resp.data) {
        const infos = createSummonerData(resp.data)
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

export const getters = {
  moreMatchesToFetch: state => state.infos.matchIndex < state.infos.matchList.length,
  summonerFound: state => state.status === 'found',
  summonerNotFound: state => state.status === 'error',
  summonerLoading: state => state.status === 'loading',
}
