import Vue from 'vue'

Vue.directive('focus', {
  inserted (el) {
    el.focus()
    // 子元素全部focus
    console.log(el)
    Array.prototype.slice.call(el.children).forEach(c => {
      c.focus()
    })
  }
})
