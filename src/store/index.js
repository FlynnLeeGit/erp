import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import users from './modules/users'
import layout from './modules/layout'
import project from '@/pages/project/module'
import quota from '@/pages/quota/module'

const store = new Vuex.Store({
  modules: {
    users,
    layout,
    project,
    quota
  },
  strict: false
})

export default store
