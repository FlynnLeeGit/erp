import Vue from 'vue'
import Router from 'vue-router'

import index from '@/pages/index.vue'
import login from '@/pages/login.vue'
import users from '@/pages/users/index.vue'

import quota from '@/pages/quota/index.vue'
import artficial from '@/pages/quota/artficial/index.vue'
import artficialcounter from '@/pages/quota/artficialcounter/index.vue'
import auxmaterial from '@/pages/quota/auxmaterial/index.vue'
import auxmaterialcounter from '@/pages/quota/auxmaterialcounter/index.vue'

import store from '../store'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: '首页',
    component: index,
    children: [
      {
        path: 'users',
        name: '用户管理',
        component: users
      },
      {
        path: 'quota',
        name: '定额',
        component: quota,
        children: [
          {
            path: 'artficial',
            name: '人工管理',
            component: artficial
          },
          {
            path: 'artficialcounter',
            name: '人工计量',
            component: artficialcounter
          },
          {
            path: 'auxmaterial',
            name: '辅材管理',
            component: auxmaterial
          },
          {
            path: 'auxmaterialcounter',
            name: '辅材计量',
            component: auxmaterialcounter
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: '登陆',
    component: login,
    meta: {
      skipAuth: true
    }
  }
]

const router = new Router({
  routes,
  mode: 'history',
  scrollBehavior: (to, from) => ({
    y: 0
  })
})

router.beforeEach((to, from, next) => {
  next()
  if (to.meta.skipAuth) {
    next()
  } else {
    const lsUser = JSON.parse(localStorage.getItem('erp.user'))
    if (lsUser) {
      store.commit('SET_USER', lsUser)
    }
    if (!store.state.users.user) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  }
})

export default router
