import { axios } from '@/plugins/axios'
import { createMatchData, createBasicSummonerData, createRecordsData } from '@/helpers/summoner'

export const namespaced = true

export const state = {
  basic: {
    account: {},
    currentSeason: null,
    matchList: [],
    ranked: {},
    recentActivity: [],
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
    list: {},
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
  KEEP_LAST_X_MATCHES(state, number) {
    state.overview.matchIndex = number
    state.overview.matches = state.overview.matches.slice(0, number)
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
    state.basic.recentActivity = stats.recentActivity
    state.overview.matchesLoading = false
    state.overview.matches = [...state.overview.matches, ...newMatches]
    state.overview.matchIndex += 10
    state.overview.stats = stats
    state.champions.championsLoaded = false
    state.records.recordsLoaded = false
  },
  MATCHES_FOUND50(state, { newMatches, stats }) {
    state.basic.recentActivity = stats.recentActivity
    state.overview.matchesLoading = false
    state.overview.matches = [...state.overview.matches, ...newMatches]
    state.overview.matchIndex += 50
    state.overview.stats = stats
    state.champions.championsLoaded = false
    state.records.recordsLoaded = false
  },
  OVERVIEW_FOUND(state, infos) {
    state.basic.recentActivity = infos.stats.recentActivity
    state.overview.matches = infos.matches
    state.overview.matchIndex = infos.matches.length
    state.overview.stats = infos.stats
    state.overview.loaded = true
    state.records.recordsLoaded = false
  },
  RECORDS_FOUND(state, { records }) {
    state.records.list = records
    state.records.recordsLoaded = true
  },
  SUMMONER_FOUND(state, infos) {
    state.basic.account = infos.account
    state.basic.matchList = infos.matchList
    state.basic.ranked = infos.ranked
    state.basic.recentActivity = infos.recentActivity
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
      if (!resp.data) {
        dispatch('notification/add', {
          type: 'error',
          message: 'Summoner not found.'
        }, { root: true })
        return commit('SUMMONER_NOT_FOUND')
      }

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
    } catch (error) {
      if (error.response && error.response.status === 422) {
        dispatch('notification/add', {
          type: 'error',
          message: 'Summoner not found.'
        }, { root: true })
      }
      if (error.message !== 'Summoner changed') {
        commit('SUMMONER_NOT_FOUND')
      }
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
    const resp = await axios(({
      url: 'summoner/live',
      data: {
        id: state.basic.account.id,
        region: rootState.regionsList[rootState.settings.region]
      },
      method: 'POST'
    })).catch(() => { })
    console.log('---LIVE---')
    console.log(resp.data)

    if (resp.data) {
      commit('LIVE_FOUND', { live: resp.data })
    } else {
      commit('SUMMONER_NOT_PLAYING')
    }
  },
  async moreMatches({ commit, getters, rootState }) {
    commit('MATCHES_LOADING')

    const matchIds = getters.filteredMatchList
      .slice(state.overview.matchIndex, state.overview.matchIndex + 10)

    const resp = await axios(({
      url: 'match',
      data: {
        puuid: state.basic.account.puuid,
        region: rootState.regionsList[rootState.settings.region],
        matchIds
      },
      method: 'POST'
    })).catch(() => { })
    console.log('---MATCHES INFOS---')
    console.log(resp.data)
    const newMatches = createMatchData(resp.data.matches)
    commit('MATCHES_FOUND', { newMatches, stats: resp.data.stats })
  },
  async more50Matches({ commit, getters, rootState }) {
    commit('MATCHES_LOADING')

    const matchIds = getters.filteredMatchList
      .slice(state.overview.matchIndex, state.overview.matchIndex + 50)

    const resp = await axios(({
      url: 'match',
      data: {
        puuid: state.basic.account.puuid,
        region: rootState.regionsList[rootState.settings.region],
        matchIds
      },
      method: 'POST'
    })).catch(() => { })
    console.log('---MATCHES INFOS---')
    console.log(resp.data)
    const newMatches = createMatchData(resp.data.matches)
    commit('MATCHES_FOUND50', { newMatches, stats: resp.data.stats })
  },
  async overviewRequest({ commit, rootState }) {
    const resp = await axios(({
      url: 'summoner/overview',
      data: {
        puuid: state.basic.account.puuid,
        accountId: state.basic.account.accountId,
        region: rootState.regionsList[rootState.settings.region],
      },
      method: 'POST'
    })).catch(() => { })
    console.log('---OVERVIEW---')
    console.log(resp.data)
    resp.data.matches = createMatchData(resp.data.matchesDetails)
    commit('OVERVIEW_FOUND', resp.data)
  },
  async recordsRequest({ commit }) {
    const resp = await axios(({ url: 'summoner/records', data: { puuid: state.basic.account.puuid }, method: 'POST' })).catch(() => { })
    console.log('---RECORDS---')
    console.log(resp.data)
    const records = resp.data.length ? createRecordsData(resp.data) : {}

    commit('RECORDS_FOUND', { records })
  },
  sliceOverviewMatches({ commit }, number) {
    commit('KEEP_LAST_X_MATCHES', number)
  },
  updateSeason({ commit }, season) {
    commit('UPDATE_SEASON', { season })
  }
}

export const getters = {
  filteredMatchList: (state, getters) => {
    return state.basic.matchList
      .filter(match => !getters.regionFilterApplied || match.seasonMatch === state.basic.currentSeason)
  },
  matchesLoading: state => state.overview.matchesLoading,
  moreMatchesToFetch: (state, getters) => {
    return state.overview.matchIndex < getters.filteredMatchList.length
  },
  more50MatchesToFetch: (state, getters) => {
    return state.overview.matchIndex < getters.filteredMatchList.length
  },
  overviewLoaded: state => state.overview.loaded,
  playing: state => state.live.playing,
  regionFilterApplied: state => !!state.basic.currentSeason,
  summonerFound: state => state.basic.status === 'found',
  summonerNotFound: state => state.basic.status === 'error',
  summonerLoading: state => state.basic.status === 'loading',
}
