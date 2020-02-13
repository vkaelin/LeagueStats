import { axios } from '@/plugins/axios'
import { createMatchData, createBasicSummonerData, createRecordsData } from '@/helpers/summoner'

export const namespaced = true

export const state = {
  basic: {
    account: {},
    currentSeason: null,
    matchList: [],
    ranked: {},
    seasons: [],
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
  records: {
    list: [],
    recordsLoaded: false
  },
  live: {
    match: {},
    liveLoaded: false,
    playing: false,
  },
}

export const mutations = {
  BASIC_REQUEST(state) {
    state.basic.status = 'loading'
    state.basic.currentSeason = null
    state.champions.championsLoaded = false
    state.records.recordsLoaded = false
    state.overview.loaded = false
    state.live.liveLoaded = false
  },
  CHAMPIONS_NOT_FOUND(state) {
    state.champions.championsLoaded = false
  },
  CHAMPIONS_FOUND(state, { champions }) {
    state.champions.list = champions
    state.champions.championsLoaded = true
  },
  LIVE_FOUND(state, { live }) {
    state.live.match = live
    state.live.liveLoaded = true
  },
  LIVE_LOADING(state) {
    state.live.playing = true
    state.live.liveLoaded = false
  },
  MATCHES_LOADING(state) {
    state.overview.matchesLoading = true
  },
  MATCHES_FOUND(state, { newMatches, stats }) {
    state.overview.matchesLoading = false
    state.overview.matches = [...state.overview.matches, ...newMatches]
    state.overview.matchIndex += newMatches.length
    state.overview.stats = stats
    state.champions.championsLoaded = false
    state.records.recordsLoaded = false
  },
  OVERVIEW_FOUND(state, infos) {
    state.overview.matches = infos.matches
    state.overview.matchIndex = infos.matches.length
    state.overview.stats = infos.stats
    state.overview.loaded = true
  },
  RECORDS_FOUND(state, { records }) {
    state.records.list = records
    state.records.recordsLoaded = true
  },
  SUMMONER_FOUND(state, infos) {
    state.basic.account = infos.account
    state.basic.matchList = infos.matchList
    state.basic.ranked = infos.ranked
    state.basic.seasons = infos.seasons.sort((a, b) => b - a)
    state.basic.status = 'found'
    state.live.match = infos.current
    state.live.playing = infos.playing
  },
  SUMMONER_NOT_FOUND(state) {
    state.basic.status = 'error'
  },
  SUMMONER_NOT_PLAYING(state) {
    state.live.match = {}
    state.live.playing = false
    state.live.liveLoaded = false
  },
  UPDATE_SEASON(state, { season }) {
    state.basic.currentSeason = season

    state.overview.loaded = false
    state.champions.championsLoaded = false
    state.records.recordsLoaded = false
  },
}

export const actions = {
  async basicRequest({ commit, dispatch, rootState }, { summoner, region }) {
    const regionId = rootState.regionsList[region]
    commit('BASIC_REQUEST')
    try {
      const resp = await axios(({ url: 'summoner/basic', data: { summoner, region: regionId }, method: 'POST' }))
      if (resp.data) {
        console.log(`---SUMMONER INFOS ${resp.data.account.name}---`)
        console.log(resp.data)
        const infos = createBasicSummonerData(resp.data)
        commit('SUMMONER_FOUND', infos)

        // Add summoner to recent searches
        dispatch('settings/addRecentSearch', {
          name: infos.account.name,
          icon: infos.account.profileIconId,
          region,
        }, { root: true })
      } else {
        commit('SUMMONER_NOT_FOUND')

        dispatch('notification/add', {
          type: 'error',
          message: 'Summoner not found.'
        }, { root: true })
        console.log('Summoner not found - store')
      }
    } catch (error) {
      if (error.message !== 'Summoner changed') {
        commit('SUMMONER_NOT_FOUND')
      }
      console.log(error)
    }
  },
  championsNotLoaded({ commit }) {
    commit('CHAMPIONS_NOT_FOUND')
  },
  async championsRequest({ commit }, queue = null) {
    const resp = await axios(({ url: 'summoner/champions', data: { puuid: state.basic.account.puuid, queue: queue }, method: 'POST' })).catch(() => { })
    console.log('---CHAMPIONS---')
    console.log(resp.data)

    commit('CHAMPIONS_FOUND', { champions: resp.data })
  },
  async liveMatchRequest({ commit, rootState }) {
    commit('LIVE_LOADING')
    const region = rootState.regionsList[rootState.settings.region]

    const resp = await axios(({ url: 'summoner/live', data: { account: state.basic.account, region }, method: 'POST' })).catch(() => { })
    console.log('---LIVE---')
    console.log(resp.data)

    if (resp.data) {
      commit('LIVE_FOUND', { live: resp.data })
    } else {
      commit('SUMMONER_NOT_PLAYING')
    }
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
    const resp = await axios(({ url: 'summoner/overview', data: { account: state.basic.account }, method: 'POST' })).catch(() => { })
    console.log('---OVERVIEW---')
    console.log(resp.data)
    resp.data.matches = createMatchData(resp.data.matchesDetails)
    commit('OVERVIEW_FOUND', resp.data)
  },
  async recordsRequest({ commit }) {
    const resp = await axios(({ url: 'summoner/records', data: { puuid: state.basic.account.puuid }, method: 'POST' })).catch(() => { })
    console.log('---RECORDS---')
    console.log(resp.data)
    const records = resp.data ? createRecordsData(resp.data) : {}

    commit('RECORDS_FOUND', { records })
  },
  updateSeason({ commit }, season) {
    commit('UPDATE_SEASON', { season })
  }
}

export const getters = {
  matchesLoading: state => state.overview.matchesLoading,
  moreMatchesToFetch: state => state.overview.matchIndex < state.basic.matchList.length,
  overviewLoaded: state => state.overview.loaded,
  playing: state => state.live.playing,
  summonerFound: state => state.basic.status === 'found',
  summonerNotFound: state => state.basic.status === 'error',
  summonerLoading: state => state.basic.status === 'loading',
}
