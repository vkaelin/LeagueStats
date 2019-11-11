import { axios } from '@/plugins/axios'
import { createMatchData, createMatesData, createSummonerData } from '@/helpers/summoner'

export const namespaced = true

export const state = {
  infos: {
    account: {},
    matchIndex: 0,
    matchList: [],
    matches: [],
    mates: [],
    ranked: {},
    playing: false
  },
  matchesLoading: false,
  status: '',
}

export const mutations = {
  MATCHES_LOADING(state) {
    state.matchesLoading = true
  },
  MATCHES_FOUND(state, { newMatches, mates }) {
    state.matchesLoading = false

    state.infos.matches = [...state.infos.matches, ...newMatches]

    state.infos.matchIndex += newMatches.length

    state.infos.mates = mates
  },
  SUMMONER_REQUEST(state) {
    state.status = 'loading'
  },
  SUMMONER_FOUND(state, infos) {
    state.infos.account = infos.account
    state.infos.matchList = infos.matchList
    state.infos.matches = infos.matches
    state.infos.ranked = infos.ranked
    state.infos.matchIndex = infos.matches.length
    state.infos.playing = infos.playing
    state.infos.stats = infos.stats
    state.status = 'found'
  },
  SUMMONER_NOT_FOUND(state) {
    state.status = 'error'
  }
}

export const actions = {
  async moreMatches({ commit }) {
    commit('MATCHES_LOADING')

    const account = state.infos.account
    const gameIds = state.infos.matchList.slice(state.infos.matchIndex, state.infos.matchIndex + 10).map(({ gameId }) => gameId)

    const resp = await axios(({ url: 'match', data: { account, gameIds }, method: 'POST' })).catch(() => { })
    console.log('--- MATCHES INFOS ---')
    console.log(resp.data)
    const newMatches = createMatchData(resp.data.matches)
    const mates = createMatesData(resp.data.mates)
    commit('MATCHES_FOUND', { newMatches, mates })
  },
  async summonerRequest({ commit, dispatch, rootState }, { summoner, region }) {
    region = rootState.regionsList[region]
    commit('SUMMONER_REQUEST')
    try {
      const resp = await axios(({ url: 'api', data: { summoner, region }, method: 'POST' }))
      if (resp.data) {
        console.log('--- SUMMONER INFOS ---')
        console.log(resp.data)
        dispatch('ddragon/getVersion', resp.data.version, { root: true })
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
  matchesLoading: state => state.matchesLoading,
  moreMatchesToFetch: state => state.infos.matchIndex < state.infos.matchList.length,
  playing: state => state.infos.playing,
  summonerFound: state => state.status === 'found',
  summonerNotFound: state => state.status === 'error',
  summonerLoading: state => state.status === 'loading',
}
