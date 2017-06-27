import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import users from './modules/users/index.js'

const store = new Vuex.Store({
  modules: {
    users
  },
  strict: false
})

export default store
