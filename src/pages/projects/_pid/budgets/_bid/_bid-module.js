import createStore from '@/plugins/createStore'
import { find } from '@/plugins/utils'
import items from './items/items-module'

const state = {
  budgetInfo: {}
}
const mutations = {
  SET_BUDGET_INFO (state, info) {
    state.budgetInfo = info
  }
}

const actions = {
  init ({ dispatch, commit, rootGetters }, { pid, bid }) {
    return Promise.all([
      dispatch('projects/_pid/budgets/get', pid, { root: true })
    ]).then(() => {
      commit(
        'SET_BUDGET_INFO',
        find(rootGetters['projects/_pid/budgets/list'], bid)
      )
      return {}
    })
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
