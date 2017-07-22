import createStore from '@/plugins/createStore'

import { find, findIndex, groupByField, deepCopy } from '@/plugins/utils'

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
  get () {
    return get()
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
  // 将材料根据品牌分组
  groupList: state => groupByField(state.list, 'brand'),
  groupBySpec: state => {
    const matList = deepCopy(state.list)
    const groupByBrandList = groupByField(matList, 'brand')
    const groupBySpecList = groupByField(
      matList,
      'quotaAuxiliaryMaterialSpec.id'
    )
    const matGroup = {}
    Object.keys(groupBySpecList).forEach(specName => {
      matGroup[specName] = deepCopy(groupBySpecList[specName]).map(mat => {
        const brandObj = {
          id: mat.id,
          name: mat.brand,
          children: deepCopy(groupByBrandList[mat.brand]).map(mat => ({
            id: mat.id,
            name: mat.model
          }))
        }
        if (!brandObj.children.length) {
          brandObj.disabled = true
        }
        return brandObj
      })
    })
    // 得到[规格-品牌-型号] 的tree
    return matGroup
  },
  options: (state, getters, rootState, rootGetters) => {
    const matOptionsAux = deepCopy(rootGetters['quota/auxmaterial/options'])
    const matGroupBySpec = getters['groupBySpec']

    matOptionsAux.forEach(one => {
      one.children.forEach(two => {
        two.children = deepCopy(two.children).map(spec => {
          spec.children = matGroupBySpec[spec.id]
          spec.disabled = true
          if(spec.children && spec.children.length){
            spec.disabled = false
          }
          return spec
        })
      })
    })

    console.log(deepCopy(matOptionsAux))
    return matOptionsAux
  }
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters
})
