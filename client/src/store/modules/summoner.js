import { axios } from '@/plugins/axios'
import { createMatchData, createBasicSummonerData } from '@/helpers/summoner'

export const namespaced = true

export const state = {
  basic: {
    account: {},
    matchList: [],
    ranked: {},
    playing: false,
    status: '',
  },
  overview: {
    matchIndex: 0,
    matches: [],
    stats: {},
    loaded: false,
    matchesLoading: false,
  },
  champions: {
    list: [],
    championsLoaded: false
  },
}

export const mutations = {
  BASIC_REQUEST(state) {
    state.basic.status = 'loading'
    state.champions.championsLoaded = false
    state.overview.loaded = false
  },
  CHAMPIONS_FOUND(state, { champions }) {
    state.champions.list = champions
    state.champions.championsLoaded = true
  },
  MATCHES_LOADING(state) {
    state.overview.matchesLoading = true
  },
  MATCHES_FOUND(state, { newMatches, stats }) {
    state.overview.matchesLoading = false
    state.overview.matches = [...state.infos.matches, ...newMatches]
    state.overview.matchIndex += newMatches.length
    state.overview.stats = stats
    state.champions.championsLoaded = false
  },
  OVERVIEW_FOUND(state, infos) {
    state.overview.matches = infos.matches
    state.overview.matchIndex = infos.matches.length
    state.overview.stats = infos.stats
    state.overview.loaded = true
  },
  SUMMONER_FOUND(state, infos) {
    state.basic.account = infos.account
    state.basic.matchList = infos.matchList
    state.basic.ranked = infos.ranked
    state.basic.playing = infos.playing
    state.basic.status = 'found'
  },
  SUMMONER_NOT_FOUND(state) {
    state.basic.status = 'error'
  },
}

export const actions = {
  async basicRequest({ commit, dispatch, rootState }, { summoner, region }) {
    region = rootState.regionsList[region]
    commit('BASIC_REQUEST')
    try {
      const resp = await axios(({ url: 'summoner-basic', data: { summoner, region }, method: 'POST' }))
      if (resp.data) {
        console.log('---SUMMONER INFOS---')
        console.log(resp.data)
        const infos = createBasicSummonerData(resp.data)
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
  },
  async championsRequest({ commit }, queue = null) {
    const resp = await axios(({ url: 'summoner-champions', data: { puuid: state.basic.account.puuid, queue: queue }, method: 'POST' })).catch(() => { })
    console.log('---CHAMPIONS---')
    console.log(resp.data)

    commit('CHAMPIONS_FOUND', { champions: resp.data })
  },
  async moreMatches({ commit }) {
    commit('MATCHES_LOADING')

    const account = state.basic.account
    const gameIds = state.basic.matchList.slice(state.overview.matchIndex, state.overview.matchIndex + 10).map(({ gameId }) => gameId)

    const resp = await axios(({ url: 'match', data: { account, gameIds }, method: 'POST' })).catch(() => { })
    console.log('---MATCHES INFOS---')
    console.log(resp.data)
    const newMatches = createMatchData(resp.data.matches)
    commit('MATCHES_FOUND', { newMatches, stats: resp.data.stats })
  },
  async overviewRequest({ commit }) {
    const resp = await axios(({ url: 'summoner-overview', data: { account: state.basic.account }, method: 'POST' })).catch(() => { })
    console.log('---OVERVIEW---')
    console.log(resp.data)
    resp.data.matches = createMatchData(resp.data.matchesDetails)
    commit('OVERVIEW_FOUND', resp.data)
  }
}

export const getters = {
  matchesLoading: state => state.overview.matchesLoading,
  moreMatchesToFetch: state => state.overview.matchIndex < state.basic.matchList.length,
  overviewLoaded: state => state.overview.loaded,
  playing: state => state.basic.playing,
  summonerFound: state => state.basic.status === 'found',
  summonerNotFound: state => state.basic.status === 'error',
  summonerLoading: state => state.basic.status === 'loading',
}
