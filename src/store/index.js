import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import users from './modules/users'
import layout from './modules/layout'
import quota from '@/pages/quota/module'
import purchase from '@/pages/purchase/module'

import projects from '@/pages/projects/projects-module'
const store = new Vuex.Store({
  modules: {
    users,
    layout,
    quota,
    purchase,
    projects
  },
  strict: false
})

export default store
