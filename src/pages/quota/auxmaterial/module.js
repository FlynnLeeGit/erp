import createStore from '@/plugins/createStore'

import { find, findIndex, groupByField, listToMap } from '@/plugins/utils'

import {
  get,
  create,
  update,
  del,
  createSpec,
  updateSpec,
  delSpec
} from './api'

const state = {
  list: [],
  currentDelId: 0
}

const updateAux = (state, { req, res }) => {
  const updateIdx = findIndex(state.list, req.auxId)
  state.list.splice(updateIdx, 1, res)
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
  CREATE_SPEC_SUCCESS: updateAux,
  UPDATE_SPEC_SUCCESS: updateAux,
  DELETE_SPEC_SUCCESS: updateAux
}

const actions = {
  get () {
    return get()
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
  create_spec (store, { auxId, data }) {
    return createSpec({ auxId, data })
  },
  update_spec (store, { auxId, data }) {
    return updateSpec({ auxId, data })
  },
  delete_spec (store, { auxId, specId }) {
    return delSpec({ auxId, specId })
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
  typeOpts: (state, getters) => {
    const typeMap = listToMap(state.list, 'id', 'type')
    return Object.keys(typeMap).map(type => ({
      label: type,
      value: typeMap[type],
      id: `type:${type}`,
      parentId: 0
    }))
  },
  auxOpts: state => {
    return state.list.map(aux => ({
      label: aux.name,
      value: aux.id,
      id: `aux:${aux.id}`,
      parentId: `type:${aux.type}`
    }))
  },

  specOpts: (state, getters) => {
    const opts = []
    state.list.forEach(aux => {
      if (aux.quotaAuxiliaryMaterialSpecs) {
        aux.quotaAuxiliaryMaterialSpecs.forEach(spec => {
          opts.push({
            label: spec.name,
            value: spec.id,
            id: `spec:${spec.id}`,
            parentId: `aux:${aux.id}`
          })
        })
      }
    })
    return opts
  },

  groupList: state => groupByField(state.list, 'type'),
  map: state => listToMap(state.list),
  currentDelId: state => state.currentDelId
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters
})
