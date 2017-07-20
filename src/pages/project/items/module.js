import createStore from '@/plugins/createStore'

const actions = {
  init ({ dispatch }, { pid, bid }) {
    return Promise.all([
      dispatch('project/detail/get_by_id', pid, { root: true })
    ])
  }
}

export default createStore({
  namespaced: true,
  actions
})
