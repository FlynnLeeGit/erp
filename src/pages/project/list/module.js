import createStore from '@/plugins/createStore'

import { find, findIndex } from '@/plugins/utils'

import { get, getById, create, update, del } from './api'

const state = {
  list: [],
  currentDelId: 0,
  currentProject: {}
}

const mutations = {
  GET_SUCCESS (state, { res }) {
   
    state.list = res
  },
  GET_BY_ID_SUCCESS (state, { res }) {
    state.currentProject = res
  },
  CREATE_SUCCESS (state, { req, res }) {
    state.list.push(res)
  },
  UPDATE_SUCCESS (state, { req, res }) {
    const updateIdx = findIndex(state.list, req.id)
    state.list.splice(updateIdx, 1, res)
  },
  DELETE_SUCCESS (state, { req }) {
    const delIdx = findIndex(state.list, req)
    state.list.splice(delIdx, 1)
  },
  SET_CURRENT_DEL_ID (state, currentDelId) {
    state.currentDelId = currentDelId
  }
}

const actions = {
  GET () {
    return get()
  },
  GET_BY_ID (store, pid) {
    return getById(pid)
  },
  CREATE (store, req) {
    return create(req)
  },
  UPDATE (store, req) {
    return update(req)
  },
  DELETE ({ commit }, id) {
    commit('SET_CURRENT_DEL_ID', id)
    return del(id)
  },
  INIT ({ dispatch }) {
    return Promise.all([
      dispatch('project/GET_MAP', null, { root: true }),
      dispatch('GET')
    ])
  }
}

const getArchiveList = (arr, type) => arr.filter(p => p.archiveType === type)

const getters = {
  list: state => state.list,
  currentDelId: state => state.currentDelId,
  currentProject: state => state.currentProject,
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
  getters
})
