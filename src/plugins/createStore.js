import Vue from 'vue'

/**
 *
 *
 * @param {* Object } 根据传入的actions,mutations,ajaxActions,state,getters 自动创建异步请求所需的_START _SUCCESS _FAILURE mutations
 *                    并且添加了$isAjax $ajaxError两个state变量,
 * @param {* Object} transformResponse 转换Promise的响应信息函数
 * @return {* vuex store Object} 返回vuex使用的module对象
 */
const createStore = (
  { namespaced, state, mutations, actions, getters, modules },
  options
) => {
  state = state || {}
  mutations = mutations || {}
  actions = actions || {}
  getters = getters || {}
  modules = modules || {}
  options = options || {}
  // this is useful for axios
  const defaultTransfrom = res => res.data
  const transformReponse = options.transformReponse || defaultTransfrom

  // 添加$isAjax $ajaxError变量
  state = Object.assign(state, {
    $isAjax: {}
  })

  // clone actions 对象,注入mutaions后调用
  const cloneActions = Object.assign({}, actions)

  Object.keys(actions).forEach(actionName => {
    const upperType = actionName.toUpperCase()
    actions[actionName] = (store, payload) => {
      store.commit(`${upperType}_START`, { req: payload })
      // 返回该Promise 异步请求
      return cloneActions
        [actionName](store, payload)
        .then(res => {
          store.commit(`${upperType}_SUCCESS`, {
            req: payload,
            res: transformReponse(res)
          })
          return Promise.resolve(res)
        })
        .catch(err => {
          store.commit(`${upperType}_FAILURE`, { req: payload, res: err })
          return Promise.reject(err)
        })
    }
  })

  // test mutations
  // 检测mutaion中是否有双下划线的错误写法
  Object.keys(mutations).forEach(m => {
    if (/__+/.test(m)) {
      console.warn(`${m} includes double or more underlines '_'`)
    }
  })

  // clone mutaions 为了下面注入mutaion后使用
  const cloneMutations = Object.assign({}, mutations)

  Object.keys(actions).forEach(type => {
    const upperType = type.toUpperCase()
    mutations[`${upperType}_START`] = (state, payload) => {
      Vue.set(state.$isAjax, type, true)
      if (cloneMutations[`${upperType}_START`]) {
        cloneMutations[`${upperType}_START`](state, payload)
      }
    }
    mutations[`${upperType}_SUCCESS`] = (state, payload) => {
      Vue.set(state.$isAjax, type, false)
      if (cloneMutations[`${upperType}_SUCCESS`]) {
        cloneMutations[`${upperType}_SUCCESS`](state, payload)
      }
    }
    mutations[`${upperType}_FAILURE`] = (state, payload) => {
      Vue.set(state.$isAjax, type, false)
      if (cloneMutations[`${upperType}_FAILURE`]) {
        cloneMutations[`${upperType}_FAILURE`](state, payload)
      }
    }
  })

  getters.$isAjax = state => state.$isAjax

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
