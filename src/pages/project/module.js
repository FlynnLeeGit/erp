import createStore from '@/plugins/createStore'
import list from './list/module'
import detail from './detail/module'
import items from './items/module'

import { getMap } from './api'

const state = {
  map: {}
}

const mutations = {
  GET_MAP_SUCCESS (state, { res }) {
    state.map = res.project_info
  }
}

const actions = {
  get_map () {
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
    list,
    detail,
    items
  }
})
