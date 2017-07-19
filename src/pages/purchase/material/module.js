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
  DELETE_START (state, id) {
    state.currentDelId = id
  },
  DELETE_SUCCESS (state, { req }) {
    const delIdx = findIndex(state.list, req)
    state.list.splice(delIdx, 1)
  }
}

const actions = {
  GET () {
    return get()
  },
  CREATE (store, req) {
    return create(req)
  },
  UPDATE (store, req) {
    return update(req)
  },
  DELETE ({ commit }, id) {
    return del(id)
  },
  INIT ({ dispatch }) {
    return Promise.all([
      dispatch('quota/auxmaterial/GET', null, { root: true }),
      dispatch('purchase/supplier/GET', null, { root: true }),
      dispatch('GET')
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
