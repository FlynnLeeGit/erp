import createStore from '@/plugins/createStore'
import supply from './supply/module'
import material from './material/module'

export default createStore({
  namespaced: true,
  modules: {
    material,
    supply
  }
})
