import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import index from '@/pages/index.vue'
import login from '@/pages/login.vue'

import quota from '@/pages/quota/index.vue'
import artficial from '@/pages/quota/artficial/index.vue'
import auxmaterial from '@/pages/quota/auxmaterial/index.vue'
import quotaTpl from '@/pages/quota/quota/index.vue'
import release from '@/pages/quota/release/index.vue'

import purchase from '@/pages/purchase/index.vue'
import supplier from '@/pages/purchase/supplier/index.vue'
import material from '@/pages/purchase/material/index.vue'

import account from '@/pages/account/index.vue'
import accoutUsers from '@/pages/account/users.vue'
import accountPassword from '@/pages/account/password.vue'

import project from '@/pages/project/index.vue'
import projectCollect from '@/pages/project/collect/index.vue'
import projectList from '@/pages/project/list/index.vue'
import projectDetail from '@/pages/project/detail/index.vue'
import projectDetailSpace from '@/pages/project/detail/space/index.vue'
import projectDetailBudget from '@/pages/project/detail/budget/index.vue'
import projectDetailBudgetItems from '@/pages/project/items/index.vue'

Vue.use(Router)

const quotaRoutes = {
  path: 'quota',
  name: 'quota',
  component: quota,
  children: [
    {
      path: 'artficial',
      name: 'quota.artficial',
      component: artficial
    },
    {
      path: 'auxmaterial',
      name: 'quota.auxmaterial',
      component: auxmaterial
    },
    {
      path: 'quota',
      name: 'quota.quota',
      component: quotaTpl
    },
    {
      path: 'release',
      name: 'quota.release',
      component: release
    }
  ]
}

const purchaseRoutes = {
  path: 'purchase',
  component: purchase,
  name: 'purchase',
  children: [
    {
      path: 'supplier',
      name: 'purchase.supplier',
      component: supplier
    },
    {
      path: 'material',
      name: 'purchase.material',
      component: material
    }
  ]
}

const accountRoutes = {
  path: 'account',
  name: 'account',
  component: account,
  children: [
    {
      path: 'users',
      name: 'account.users',
      component: accoutUsers
    },
    {
      path: 'password',
      name: 'account.password',
      component: accountPassword
    }
  ]
}

const projectRoutes = {
  path: 'project',
  name: '项目管理',
  component: project,
  children: [
    {
      path: 'list',
      name: '项目列表',
      component: projectList
    },
    {
      path: 'collect',
      name: '常用定额',
      component: projectCollect
    },
    {
      path: ':pid/budget/:bid/items',
      name: '预算详情',
      component: projectDetailBudgetItems
    },
    {
      path: ':pid',
      name: '项目详情',
      component: projectDetail,
      children: [
        {
          path: 'space',
          name: '空间管理',
          component: projectDetailSpace
        },
        {
          path: 'budget',
          name: '预算管理',
          component: projectDetailBudget
        }
      ]
    }
  ]
}

const routes = [
  {
    path: '/',
    name: '首页',
    component: index,
    children: [quotaRoutes, purchaseRoutes, accountRoutes, projectRoutes]
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
    if (!store.state.users.user.id) {
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
