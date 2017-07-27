import createStore from '@/plugins/createStore'

import {
  find,
  findIndex,
  groupByField,
  deepCopy,
  valueInArray
} from '@/plugins/utils'

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
  create (state, req) {
    return create(req)
  },
  update (state, req) {
    return update(req)
  },
  delete (state, id) {
    return del(id)
  },
  init ({ dispatch }) {
    return Promise.all([
      dispatch('quota/auxmaterial/get', null, { root: true }),
      dispatch('purchase/supplier/get', null, { root: true }),
      dispatch('get')
    ])
  }
}

const getters = {
  list: state => state.list,
  currentDelId: state => state.currentDelId,
  brandOpts: state => {
    const opts = []
    state.list.forEach(mat => {
      const _id = `spec:${mat.quotaAuxiliaryMaterialSpec && mat.quotaAuxiliaryMaterialSpec.id}>brand:${mat.brand}`
      const _parentId = `spec:${mat.quotaAuxiliaryMaterialSpec && mat.quotaAuxiliaryMaterialSpec.id}`
      // 品牌相同 规格相同的做去重
      if (!valueInArray(opts, _id)) {
        opts.push({
          label: mat.brand,
          value: mat.id,
          id: _id,
          parentId: _parentId
        })
      }
    })
    return opts
  },
  modelOpts: state => {
    const opts = []
    state.list.forEach(mat => {
      const _parentId = `spec:${mat.quotaAuxiliaryMaterialSpec && mat.quotaAuxiliaryMaterialSpec.id}>brand:${mat.brand}`
      opts.push({
        label: `${mat.model} ${mat.packPrice}元/${mat.packUnit}`,
        value: mat.id,
        id: `model:${mat.model}`,
        parentId: _parentId
      })
    })
    return opts
  },

  // 将材料根据品牌分组
  groupList: state => groupByField(state.list, 'brand')
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters
})
