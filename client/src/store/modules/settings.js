export const namespaced = true

export const state = {
  percent: false
}

export const mutations = {
  UPDATE_PERCENT(state, percent) {
    state.percent = percent
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
  }
}
