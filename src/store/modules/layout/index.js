import axios from '@/plugins/axios'
import router from '@/router'

const state = {
  sideHide: false
}

const mutations = {
  TOGGLE_SIDE_HIDE (state) {
    state.sideHide = !state.sideHide
  }
}

const getters = {
  sideHide: state => state.sideHide
}

export default {
  state,
  mutations,
  getters
}
