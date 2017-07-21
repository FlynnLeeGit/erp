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
  groupList: state => groupByField(state.list, 'type'),
  // 返回element 级联选择器的options 结构 [{id:1,name:'I',children:[{id:11:name:'II',children:[...]}]}]
  options: state => {
    const options = []
    state.list.forEach(item => {
      item.children = item.quotaAuxiliaryMaterialSpecs
      if (!item.children.length) {
        // 没有可选的规格时直接禁用
        item.disabled = true
      }
    })
    const groupList = groupByField(state.list, 'type')
    Object.keys(groupList).forEach(type => {
      options.push({ name: type, id: type, children: groupList[type] })
    })
    return options
  },

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
