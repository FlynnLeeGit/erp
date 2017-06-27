import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import router from './router'
import store from './store'
import './plugins/directives'

Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
