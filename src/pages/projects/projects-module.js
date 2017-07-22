import createStore from '@/plugins/createStore'

import { find, findIndex } from '@/plugins/utils'

import { get, create, update, del, getMap } from './api'

import _pid from './_pid/_pid-module'

const state = {
  map: {},
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
  },
  GET_MAP_SUCCESS (state, { res }) {
    state.map = res.project_info
  }
}

const actions = {
  get_map () {
    return getMap()
  },
  get () {
    return get()
  },
  create (store, req) {
    return create(req)
  },
  update (store, req) {
    return update(req)
  },
  delete (store, id) {
    return del(id)
  },
  init ({ dispatch }) {
    return Promise.all([dispatch('get_map'), dispatch('get')])
  }
}

const getArchiveList = (arr, type) => arr.filter(p => p.archiveType === type)

const getters = {
  map: state => state.map,
  list: state => state.list,
  currentDelId: state => state.currentDelId,
  archiveLists: state => ({
    1: getArchiveList(state.list, 1),
    2: getArchiveList(state.list, 2),
    3: getArchiveList(state.list, 3),
    4: getArchiveList(state.list, 4)
  })
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  modules: {
    _pid
  }
})
