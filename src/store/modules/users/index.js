import axios from '@/plugins/axios'
import router from '@/router'

const state = {
  user: null
}

const mutations = {
  SET_USER (state, user) {
    state.user = user
    axios.setHeader('X-SFDD-AUTH', user.token)
  },
  LOGOUT (state) {
    state.user = null
  }
}
const actions = {
  login ({ commit }, user) {
    return axios.post('/_api/open/tokens', user).then(({ data }) => {
      localStorage.setItem('erp.user', JSON.stringify(data))
      commit('SET_USER', data)
      return data
    })
  },
  logout ({ commit }, redirect = '/') {
    localStorage.removeItem('erp.user')
    commit('LOGOUT')
    router.push({
      path: '/login',
      query: {
        redirect
      }
    })
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
