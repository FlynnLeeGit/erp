import createStore from '@/plugins/createStore'

import { find, findIndex } from '@/plugins/utils'

import { get, create, update, del } from './api'

const state = {
  list: [],
  currentDelId: 0
}

const mutations = {
  GET_SUCCESS (state, { res }) {
    state.list = res
  },
  CREATE_SUCCESS (state, { req, res }) {
    state.list.push(res)
  },
  UPDATE_SUCCESS (state, { req, res }) {
    const updateIdx = findIndex(state.list, req.id)
    state.list.splice(updateIdx, 1, res)
  },
  DELETE_START (state, { req }) {
    state.currentDelId = req.sid
  },
  DELETE_SUCCESS (state, { req }) {
    const delIdx = findIndex(state.list, req.sid)
    state.list.splice(delIdx, 1)
  }
}

const actions = {
  get ({ getters }, pid) {
    if (!getters['list'].length) {
      return get(pid)
    }
  },
  create (store, { pid, data }) {
    return create({ pid, data })
  },
  update (store, data) {
    return update(data)
  },
  delete (store, { pid, sid }) {
    return del({ pid, sid })
  },
  init ({ dispatch }, pid) {
    return Promise.all([dispatch('get', pid)])
  }
}

const getters = {
  list: state => state.list,
  currentDelId: state => state.currentDelId
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters
})
