import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import router from './router'
import store from './store'
import './plugins/directives'
import * as utils from './plugins/utils'

import InlineEdit from '@/components/InlineEdit.vue'
import Search from '@/components/Search.vue'
import Card from '@/components/Card.vue'

Vue.use(ElementUI)
Vue.prototype.$utils = utils
Vue.component(InlineEdit.name, InlineEdit)
Vue.component(Search.name, Search)
Vue.component(Card.name, Card)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
