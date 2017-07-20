import createStore from '@/plugins/createStore'

import { get, getByVersion, getQuota } from './api'
import { listToMap } from '@/plugins/utils'

const state = {
  list: [],
  prevTableData: [],
  nextTableData: []
}

const mutations = {
  GET_SUCCESS (state, { res }) {
    state.list = res
  },
  GET_PREV_VERSION_SUCCESS (state, { res }) {
    state.prevTableData = res
  },
  GET_NEXT_VERSION_SUCCESS (state, { res }) {
    state.nextTableData = res
  }
}
const actions = {
  get () {
    return get()
  },
  get_prev_version (store, version) {
    return version === 'latest' ? getQuota() : getByVersion(version)
  },
  get_next_version (store, version) {
    return version === 'latest' ? getQuota() : getByVersion(version)
  },
  diff_version ({ dispatch }, { prevVersion, nextVersion }) {
    return Promise.all([
      dispatch('get_prev_version', prevVersion),
      dispatch('get_next_version', nextVersion)
    ])
  },
  init ({ dispatch }) {
    return Promise.all([dispatch('get')])
  }
}

const getters = {
  list: state => state.list,
  map: state => listToMap(state.list, 'description', 'version'),
  listPlusLatest: state => {
    const sorted = state.list.slice().sort((a, b) => b.version - a.version)
    sorted.unshift({
      version: 'latest',
      description: '正在编辑中的'
    })
    return sorted
  },
  prevTableData: state => state.prevTableData,
  nextTableData: state => state.nextTableData
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters
})
