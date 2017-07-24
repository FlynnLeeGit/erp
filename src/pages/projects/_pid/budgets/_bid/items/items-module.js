import createStore from '@/plugins/createStore'
import { get, create, update, del, updateRate, createPdf } from './api'
import { find, findIndex } from '@/plugins/utils'

const state = {
  budgetData: {
    items: {}
  },
  currentSid: 0,
  currentIid: 0
}

const updateBudgetItems = (state, { req, res }) => {
  state.budgetData = res
}

const mutations = {
  GET_SUCCESS (state, { req, res }) {
    state.budgetData = res
  },
  CREATE_SUCCESS: updateBudgetItems,
  UPDATE_SUCCESS: updateBudgetItems,
  DELETE_START (state, { req, res }) {
    state.currentSid = req.sid
    state.currentIid = req.iid
  },
  DELETE_SUCCESS: updateBudgetItems,
  UPDATE_RATE_SUCCESS: updateBudgetItems,
  CREATE_PDF_SUCCESS (state, { req, res }) {
    console.log('pdf success')
  }
}
const actions = {
  get (store, bid) {
    return get(bid)
  },
  create (store, { bid, data }) {
    return create({ bid, data })
  },
  update (store, { bid, sid, iid, data }) {
    return update({ bid, sid, iid, data })
  },
  delete (store, { bid, sid, iid }) {
    return del({ bid, sid, iid })
  },
  update_rate (store, { bid, data }) {
    return updateRate({ bid, data })
  },
  create_pdf (store, { bid, data }) {
    return createPdf({ bid, data })
  },
  init ({ dispatch }, { pid, bid }) {
    return Promise.all([
      dispatch('get', bid),
      dispatch('projects/_pid/spaces/get', pid, { root: true })
    ])
  }
}
const getters = {
  budgetData: state => state.budgetData,
  currentSid: state => state.currentSid,
  currentIid: state => state.currentIid
}

export default createStore({
  namespaced: true,
  state,
  mutations,
  actions,
  getters
})
