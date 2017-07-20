import createStore from '@/plugins/createStore'
import Vue from 'vue'

import {
  find,
  findIndex,
  groupByField,
  listToMap,
  replaceObjectFields
} from '@/plugins/utils'

import {
  get,
  create,
  update,
  del,
  createArtficialCount,
  updateArtficialCount,
  delArtficialCount,
  createAuxmaterialCount,
  updateAuxmaterialCount,
  delAuxmaterialCount,
  releaseQuota
} from './api'

const state = {
  list: [],
  currentDelId: 0,

  currentDelQid: 0,
  currentDelArtId: 0,
  currentDelAuxId: 0
}

const updateQuota = (state, { req, res }) => {
  const updateItem = find(state.list, req.qid)
  replaceObjectFields(updateItem, res)
}

const mutations = {
  GET_SUCCESS (state, { res }) {
    state.list = res
  },
  CREATE_SUCCESS (state, { req, res }) {
    state.list.push(res)
  },
  UPDATE_SUCCESS (state, { req, res }) {
    const updateItem = find(state.list, req.id)
    // 字段替换更新
    replaceObjectFields(updateItem, res)
  },
  DELETE_START (state, id) {
    state.currentDelId = id
  },
  DELETE_SUCCESS (state, { req }) {
    const delIdx = findIndex(state.list, req)
    state.list.splice(delIdx, 1)
  },

  // 人工计量 mutations
  CREATE_ARTFICIAL_COUNT_SUCCESS: updateQuota,
  UPDATE_ARTFICIAL_COUNT_SUCCESS: updateQuota,
  DELETE_ARTFICIAL_COUNT_START (state, { req }) {
    state.currentDelQid = req.qid
    state.currentDelArtId = req.artId
  },
  DELETE_ARTFICIAL_COUNT_SUCCESS: updateQuota,

  // 辅材计量mutations
  CREATE_AUXMATERIAL_COUNT_SUCCESS: updateQuota,
  UPDATE_AUXMATERIAL_COUNT_SUCCESS: updateQuota,
  DELETE_AUXMATERIAL_COUNT_START (state, { req }) {
    state.currentDelQid = req.qid
    state.currentDelAuxId = req.auxId
  },
  DELETE_AUXMATERIAL_COUNT_SUCCESS: updateQuota
}

const actions = {
  get () {
    return get()
  },
  create (store, data) {
    return create(data)
  },
  update (store, data) {
    return update(data)
  },
  delete (store, id) {
    return del(id)
  },

  create_artficial_count (store, { qid, data }) {
    return createArtficialCount({ qid, data })
  },
  update_artficial_count (store, { qid, data }) {
    return updateArtficialCount({ qid, data })
  },
  delete_artficial_count (store, { qid, artId }) {
    return delArtficialCount({ qid, artId })
  },

  create_auxmaterial_count (store, { qid, data }) {
    return createAuxmaterialCount({ qid, data })
  },
  update_auxmaterial_count (store, { qid, data }) {
    return updateAuxmaterialCount({ qid, data })
  },
  delete_auxmaterial_count (store, { qid, auxId }) {
    return delAuxmaterialCount({ qid, auxId })
  },

  release_quota (store, data) {
    return releaseQuota(data)
  },
  init ({ dispatch }) {
    return Promise.all([
      dispatch('get'),
      dispatch('quota/GET_MAP', null, { root: true }),
      dispatch('quota/artficial/GET', null, { root: true }),
      dispatch('quota/auxmaterial/GET', null, { root: true }),
      dispatch('purchase/material/GET', null, { root: true })
    ])
  }
}

const getters = {
  list: state => state.list,
  currentDelId: state => state.currentDelId,

  currentDelQid: state => state.currentDelQid,
  currentDelArtId: state => state.currentDelArtId,
  currentDelAuxId: state => state.currentDelAuxId
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters
})
