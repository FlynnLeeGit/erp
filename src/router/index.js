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

import collects from '../pages/collects/index.vue'

import projects from '../pages/projects/index.vue'
import projectsPid from '../pages/projects/_pid/index.vue'
import projectsPidBudgets from '../pages/projects/_pid/budgets/index.vue'
import projectsPidSpaces from '../pages/projects/_pid/spaces/index.vue'
import projectsPidBudgetsBid
  from '../pages/projects/_pid/budgets/_bid/index.vue'
import projectsPidBudgetsBidItems
  from '../pages/projects/_pid/budgets/_bid/items/index.vue'
import projectsPidBudgetsBidStatistics
  from '../pages/projects/_pid/budgets/_bid/statistics/index.vue'

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

const projectsRoutes = {
  path: 'projects/:pid?',
  component: projectsPid,
  name: 'projects-pid',
  children: [
    {
      path: 'spaces',
      component: projectsPidSpaces,
      name: 'projects-pid-spaces'
    },
    {
      path: 'budgets',
      component: projectsPidBudgets,
      name: 'projects-pid-budgets'
    },
    {
      path: 'budgets/:bid?',
      component: projectsPidBudgetsBid,
      name: 'projects-pid-budgets-bid',
      children: [
        {
          path: 'items',
          component: projectsPidBudgetsBidItems,
          name: 'projects-pid-budgets-bid-items'
        },
        {
          path: 'statistics',
          component: projectsPidBudgetsBidStatistics,
          name: 'projects-pid-budgets-bid-statistics'
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
    children: [
      quotaRoutes,
      purchaseRoutes,
      accountRoutes,
      {
        path: 'collects',
        component: collects,
        name: 'collects'
      },
      {
        path: 'projects',
        component: projects,
        name: 'projects'
      },
      projectsRoutes
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
