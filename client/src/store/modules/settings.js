export const namespaced = true

export const state = {
  favorites: [],
  percent: false,
  recentSearches: [],
  region: 'euw',
}

export const mutations = {
  ADD_FAVORITE(state, summoner) {
    state.favorites.push(summoner)
  },
  ADD_SEARCH(state, summoner) {
    let searches = state.recentSearches

    const alreadySearch = searches.find(s => s.name === summoner.name)
    if (alreadySearch) {
      alreadySearch.date = Date.now()
      searches.sort((a, b) => b.date - a.date)
      return
    }

    if (searches.length >= 6) {
      searches.pop()
    }

    summoner.date = Date.now()
    searches.unshift(summoner)
  },
  REMOVE_FAVORITE(state, summonerName) {
    state.favorites = state.favorites.filter(s => s.name !== summonerName)
  },
  REMOVE_SEARCH(state, summonerName) {
    state.recentSearches = state.recentSearches.filter(s => s.name !== summonerName)
  },
  UPDATE_SETTING(state, { name, value }) {
    state[name] = value
  }
}

export const actions = {
  addRecentSearch({ commit, dispatch, state }, summoner) {
    commit('ADD_SEARCH', summoner)
    dispatch('updateSettings', { name: 'recentSearches', value: state.recentSearches, isJson: true })
  },
  removeRecentSearch({ commit, dispatch }, summoner) {
    commit('REMOVE_SEARCH', summoner.name)
    dispatch('updateSettings', { name: 'recentSearches', value: state.recentSearches, isJson: true })
  },
  updateFavorite({ commit, dispatch, state }, summoner) {
    const alreadyFav = state.favorites.find(s => s.name === summoner.name)
    if (alreadyFav) {
      commit('REMOVE_FAVORITE', summoner.name)
    } else {
      if (state.favorites.length >= 6) {
        // Display error message
        return dispatch('notification/add', {
          type: 'error',
          message: 'Too many favorite summoners.'
        }, { root: true })
      }
      commit('ADD_FAVORITE', summoner)
    }

    dispatch('updateSettings', { name: 'favorites', value: state.favorites, isJson: true })
  },
  updatePercent({ commit }, percent) {
    if (typeof (percent) !== 'boolean') {
      percent = localStorage.getItem('settings-percent') === 'true'
    } else {
      localStorage.setItem('settings-percent', percent)
    }
    commit('UPDATE_SETTING', { name: 'percent', value: percent })
  },
  updateSettings({ commit }, { name, value, isJson = false }) {
    if (!value) {
      value = localStorage.getItem(name)
      value = isJson ? JSON.parse(value) : value
      if (!value) return
    } else {
      localStorage.setItem(name, isJson ? JSON.stringify(value) : value)
    }
    commit('UPDATE_SETTING', { name, value })
  }
}
