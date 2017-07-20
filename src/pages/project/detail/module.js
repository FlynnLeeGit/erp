import createStore from '@/plugins/createStore'
import budget from './budget/module'
import space from './space/module'

import { getById } from './api'

const state = {
  currentProject: {}
}

const mutations = {
  GET_BY_ID_SUCCESS (state, { res }) {
    state.currentProject = res
  }
}

const actions = {
  get_by_id (store, pid) {
    return getById(pid)
  }
}

const getters = {
  currentProject: state => state.currentProject
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  modules: {
    budget,
    space
  }
})
