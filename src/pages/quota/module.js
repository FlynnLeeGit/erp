import createStore from '@/plugins/createStore'

import artficial from './artficial/module'
import auxmaterial from './auxmaterial/module'
import quota from './quota/module'

import { getMap } from './api'

const state = {
  map: {}
}

const mutations = {
  GET_MAP_SUCCESS (state, { res }) {
    state.map = res.quota_template
  }
}

const actions = {
  GET_MAP () {
    return getMap()
  }
}

const getters = {
  map: state => state.map
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  modules: {
    artficial,
    auxmaterial,
    quota
  }
})
