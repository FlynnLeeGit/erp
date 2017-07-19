import createStore from '@/plugins/createStore'
import supplier from './supplier/module'
import material from './material/module'

export default createStore({
  namespaced: true,
  modules: {
    material,
    supplier
  }
})
