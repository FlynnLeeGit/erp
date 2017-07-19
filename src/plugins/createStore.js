import Vue from 'vue'

/**
 * 根据传入的actions,mutations,ajaxActions,state,getters 自动创建异步请求所需的_START _SUCCESS _FAILURE mutations
 * 并且添加了$isAjax $ajaxError两个state变量,
 * @param {* Object }
 * @param {* Object.ajaxActions } Array 标注ajax请求action
 * @return {* vuex store Object} 返回vuex使用的module对象
 */
const createStore = ({
  namespaced,
  state,
  mutations,
  actions,
  getters,
  modules
}) => {
  state = state || {}
  mutations = mutations || {}
  actions = actions || {}
  getters = getters || {}
  modules = modules || {}

  // 添加$isAjax $ajaxError变量
  state = Object.assign(state, {
    $isAjax: {},
    // $ajaxError: {}
  })

  // clone actions 对象,注入mutaions后调用
  const cloneActions = Object.assign({}, actions)

  Object.keys(actions).forEach(actionName => {
    actions[actionName] = (store, payload) => {
      store.commit(`${actionName}_START`, payload)
      // 返回该Promise 异步请求
      return cloneActions
        [actionName](store, payload)
        .then(({ data }) => {
          store.commit(`${actionName}_SUCCESS`, { req: payload, res: data })
          return Promise.resolve(data)
        })
        .catch(err => {
          store.commit(`${actionName}_FAILURE`, err)
          return Promise.reject(err)
        })
    }
  })

  // clone mutaions 为了下面注入mutaion后使用
  const cloneMutations = Object.assign({}, mutations)

  Object.keys(actions).forEach(type => {
    mutations[`${type}_START`] = (state, payload) => {
      Vue.set(state.$isAjax, type, true)
      if (cloneMutations[`${type}_START`]) {
        cloneMutations[`${type}_START`](state, payload)
      }
    }
    mutations[`${type}_SUCCESS`] = (state, payload) => {
      if (cloneMutations[`${type}_SUCCESS`]) {
        cloneMutations[`${type}_SUCCESS`](state, payload)
      }
      Vue.set(state.$isAjax, type, false)
    }
    mutations[`${type}_FAILURE`] = (state, payload) => {
      Vue.set(state.$isAjax, type, false)
      // Vue.set(state.$ajaxError, type, payload)
      if (cloneMutations[`${type}_FAILURE`]) {
        cloneMutations[`${type}_FAILURE`](state, payload)
      }
    }
  })

  getters.$isAjax = state => state.$isAjax
  // getters.$ajaxError = state => state.$ajaxError

  return {
    namespaced,
    state,
    mutations,
    actions,
    getters,
    modules
  }
}

export default createStore
