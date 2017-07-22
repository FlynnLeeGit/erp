import createStore from '@/plugins/createStore'
import spaces from './spaces/spaces-module'
import budgets from './budgets/budgets-module'

import { getById } from './api'

const state = {
  projectInfo: {},
  showPidTabs: true
}

const mutations = {
  GET_BY_ID_SUCCESS (state, { res }) {
    state.projectInfo = res
  },
  HIDE_PID_TABS (state) {
    state.showPidTabs = false
  },
  SHOW_PID_TABS (state) {
    state.showPidTabs = true
  }
}

const actions = {
  get_by_id (store, pid) {
    return getById(pid)
  }
}

const getters = {
  projectInfo: state => state.projectInfo,
  showPidTabs: state => state.showPidTabs
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
