import createStore from '@/plugins/createStore'
import spaces from './spaces/module'
import budgets from './budgets/module'

import { getById } from './api'

const state = {
  projectInfo: {}
}

const mutations = {
  GET_BY_ID_SUCCESS (state, { res }) {
    state.projectInfo = res
  }
}

const actions = {
  get_by_id (store, pid) {
    return getById(pid)
  }
}

const getters = {
  projectInfo: state => state.projectInfo
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  modules: {
    spaces,
    budgets
  }
})
