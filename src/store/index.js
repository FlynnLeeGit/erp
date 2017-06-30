import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import users from './modules/users'
import layout from './modules/layout'

const store = new Vuex.Store({
  modules: {
    users,
    layout
  },
  strict: false
})

export default store
