import Vue from 'vue'
import Vuex from 'vuex'
import * as notification from '@/store/modules/notification'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    notification,
  },
  strict: debug
})
