export const namespaced = true

export const state = {
  percent: false,
  region: 'euw',
}

export const mutations = {
  UPDATE_PERCENT(state, percent) {
    state.percent = percent
  },
  UPDATE_REGION(state, region) {
    state.region = region
  }
}

export const actions = {
  async updatePercent({ commit }, percent) {
    if (typeof (percent) !== 'boolean') {
      percent = localStorage.getItem('settings-percent') === 'true'
    } else {
      localStorage.setItem('settings-percent', percent)
    }
    commit('UPDATE_PERCENT', percent)
  },
  async updateSettings({ commit }, { name, value }) {
    if (!value) {
      value = localStorage.getItem(name)
      if (!value) return
    } else {
      localStorage.setItem(name, value)
    }
    commit(`UPDATE_${name.toUpperCase()}`, value)
  }
}
