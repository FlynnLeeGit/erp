import axios from '@/plugins/axios'
import router from '@/router'

const state = {
  user: null
}

const mutations = {
  SET_USER (state, user) {
    state.user = user
  },
  LOGOUT (state) {
    state.user = null
  }
}
const actions = {
  login ({ commit }, user) {
    return axios.post('/_api/user/tokens', user).then(({ data }) => {
      localStorage.setItem('erp.user', JSON.stringify(data))
      commit('SET_USER', data)
    })
  },
  logout ({ commit }) {
    localStorage.removeItem('erp.user')
    commit('LOGOUT')
    router.push('/login')
  }
}
const getters = {
  user: state => state.user
}

export default {
  state,
  mutations,
  actions,
  getters
}
