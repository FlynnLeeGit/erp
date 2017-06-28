import Vue from 'vue'
import Router from 'vue-router'

import index from '@/pages/index.vue'
import login from '@/pages/login.vue'
import users from '@/pages/users/index.vue'

import quota from '@/pages/quota/index.vue'
import artficial from '@/pages/quota/artficial/index.vue'
import auxmaterial from '@/pages/quota/auxmaterial/index.vue'
import quotaTpl from '@/pages/quota/quota/index.vue'

import purchase from '@/pages/purchase/index.vue'
import supply from '@/pages/purchase/supply/index.vue'
import material from '@/pages/purchase/material/index.vue'

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
            path: 'auxmaterial',
            name: '辅材管理',
            component: auxmaterial
          },
          {
            path: 'quota',
            name: '定额模版',
            component: quotaTpl
          }
        ]
      },
      {
        path: 'purchase',
        component: purchase,
        name: '采购管理',
        children: [
          {
            path: 'supply',
            component: supply,
            name: '供应商管理'
          },
          {
            path: 'material',
            component: material,
            name: '材料管理'
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
