import axios from '@/plugins/axios'
import router from '@/router'
import { Message } from 'element-ui'

const state = {
  user: {},
  pass: {}
}

const mutations = {
  SET_USER (state, user) {
    state.user = user
    if (!user.roles) {
      Message.error('不存在用户权限列表')
    }
    const inArr = (str, arr) => arr.indexOf(str) > -1

    state.pass = {
      quota: inArr('ROLE_QUOTA', user.roles),
      purchase: inArr('ROLE_PURCHASE', user.roles),
      account: inArr('ROLE_USER', user.roles),
      project: inArr('ROLE_PROJECT', user.roles)
    }
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
  user: state => state.user,
  userPass: state => state.pass
}

export default {
  state,
  mutations,
  actions,
  getters
}
