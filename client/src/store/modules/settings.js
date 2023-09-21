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
    const alreadyFav = state.favorites.find(
      (s) => s.name === summoner.name && s.region === summoner.region
    )
    if (alreadyFav) {
      return
    }

    let searches = state.recentSearches

    const alreadySearch = searches.find(
      (s) => s.name === summoner.name && s.region === summoner.region
    )
    if (alreadySearch) {
      alreadySearch.date = Date.now()
      searches.sort((a, b) => b.date - a.date)
      return
    }

    if (searches.length > 10) {
      searches.pop()
    }

    summoner.date = Date.now()
    searches.unshift(summoner)
  },
  REMOVE_FAVORITE(state, summoner) {
    state.favorites = state.favorites.filter(
      (s) => s.name !== summoner.name || s.region !== summoner.region
    )
  },
  REMOVE_SEARCH(state, summoner) {
    state.recentSearches = state.recentSearches.filter(
      (s) => s.name !== summoner.name || s.region !== summoner.region
    )
  },
  UPDATE_SETTING(state, { name, value }) {
    state[name] = value
  },
}

export const actions = {
  addRecentSearch({ commit, dispatch, state }, summoner) {
    commit('ADD_SEARCH', summoner)
    dispatch('updateSettings', {
      name: 'recentSearches',
      value: state.recentSearches,
      isJson: true,
    })
  },
  removeRecentSearch({ commit, dispatch }, summoner) {
    commit('REMOVE_SEARCH', summoner)
    dispatch('updateSettings', {
      name: 'recentSearches',
      value: state.recentSearches,
      isJson: true,
    })
  },
  updateFavorite({ commit, dispatch, state }, summoner) {
    const alreadyFav = state.favorites.find(
      (s) => s.name === summoner.name && s.region === summoner.region
    )
    if (alreadyFav) {
      commit('REMOVE_FAVORITE', summoner)
    } else {
      if (state.favorites.length >= 6) {
        // Display error message
        return dispatch(
          'notification/add',
          {
            type: 'error',
            message: 'Too many favorite summoners.',
          },
          { root: true }
        )
      }
      commit('ADD_FAVORITE', summoner)
      const searched = state.recentSearches.find(
        (s) => s.name === summoner.name && s.region === summoner.region
      )
      if (searched) {
        dispatch('removeRecentSearch', summoner)
      }
    }

    dispatch('updateSettings', { name: 'favorites', value: state.favorites, isJson: true })
  },
  updatePercent({ commit }, percent) {
    if (typeof percent !== 'boolean') {
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
  },
}
