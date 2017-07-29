import createStore from '@/plugins/createStore'

import { find, findIndex } from '@/plugins/utils'

import { get, create, update, del, copy } from './api'
import _bid from './_bid/_bid-module'

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
  COPY_SUCCESS (state, { req, res }) {
    state.list.push(res)
  },
  UPDATE_SUCCESS (state, { req, res }) {
    const updateIdx = findIndex(state.list, req.id)
    state.list.splice(updateIdx, 1, res)
  },
  DELETE_START (state, { req }) {
    state.currentDelId = req.bid
  },
  DELETE_SUCCESS (state, { req }) {
    const delIdx = findIndex(state.list, req.bid)
    state.list.splice(delIdx, 1)
  }
}

const actions = {
  get ({ getters }, pid) {
    return get(pid)
  },
  create (store, { pid, data }) {
    return create({ pid, data })
  },
  copy (store, { pid, data }) {
    return copy({ pid, data })
  },
  update (store, data) {
    return update(data)
  },
  delete (store, { pid, bid }) {
    return del({ pid, bid })
  },
  init ({ dispatch }, pid) {
    return Promise.all([
      dispatch('get', pid),
      dispatch('quota/release/get', null, { root: true })
    ])
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
  getters,
  modules: {
    _bid
  }
})
