import createStore from '@/plugins/createStore'
import { getByBid } from './api'
import items from './items/items-module'

const state = {
  budgetInfo: {}
}
const mutations = {
  GET_BY_BID_SUCCESS (state, { req, res }) {
    state.budgetInfo = res
  }
}

const actions = {
  get_by_bid (store, { pid, bid }) {
    return getByBid({ pid, bid })
  }
}

const getters = {
  budgetInfo: state => state.budgetInfo
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  modules: {
    items
  }
})
