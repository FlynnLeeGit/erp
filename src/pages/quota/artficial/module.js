import createStore from '@/plugins/createStore'

import { find, findIndex, deepCopy } from '@/plugins/utils'

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
    state.currentDelId = req
  },
  DELETE_SUCCESS (state, { req }) {
    const delIdx = findIndex(state.list, req)
    state.list.splice(delIdx, 1)
  }
}

const actions = {
  get ({ getters }) {
    if (!getters['list'].length) {
      return get()
    }
  },
  create (store, req) {
    return create(req)
  },
  update (store, req) {
    return update(req)
  },
  delete ({ commit }, id) {
    return del(id)
  },
  init ({ dispatch }) {
    return Promise.all([
      dispatch('quota/get_map', null, { root: true }),
      dispatch('get')
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
  getters
})
