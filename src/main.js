import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import Meta from 'vue-meta'

import router from './router'
import store from './store'
import './plugins/directives'
import * as utils from './plugins/utils'

import InlineEdit from '@/components/InlineEdit.vue'
import Search from '@/components/Search.vue'
import Card from '@/components/Card.vue'
import CardPlus from '@/components/CardPlus.vue'
import DiffCell from '@/components/DiffCell.vue'
import DialogWrapper from '@/components/DialogWrapper.vue'

Vue.use(ElementUI)
Vue.use(Meta)

Vue.prototype.$utils = utils
Vue.prototype.$log = console.log

Vue.component(InlineEdit.name, InlineEdit)
Vue.component(Search.name, Search)
Vue.component(Card.name, Card)
Vue.component(CardPlus.name, CardPlus)
Vue.component(DiffCell.name, DiffCell)
Vue.component(DialogWrapper.name, DialogWrapper)

Vue.config.devtools = true

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
