import createStore from '@/plugins/createStore'
import { getBudgetItems } from './api'

const state = {
  prevTable: {},
  nextTable: {}
}

const mutations = {
  GET_PREV_ITEMS_SUCCESS (state, { req, res }) {
    if (res) {
      // 空间为key的数据
      state.prevTable = res.items
    }
  },
  GET_NEXT_ITEMS_SUCCESS (state, { req, res }) {
    if (res) {
      state.nextTable = res.items
    }
  }
}

const actions = {
  get_prev_items (store, bid) {
    return getBudgetItems(bid)
  },
  get_next_items (store, bid) {
    return getBudgetItems(bid)
  },
  diff_items ({ dispatch }, { prevBid, nextBid }) {
    return Promise.all([
      dispatch('get_prev_items', prevBid),
      dispatch('get_next_items', nextBid)
    ])
  },
  init ({ dispatch }, pid) {
    console.log(pid)
    return Promise.all([
      dispatch('projects/_pid/budgets/get', pid, { root: true }),
      dispatch('projects/_pid/spaces/get', pid, { root: true })
    ])
  }
}

const getters = {
  prevTable: state => state.prevTable,
  nextTable: state => state.nextTable
}

export default createStore({
  namespaced: true,
  state,
  actions,
  mutations,
  getters
})
