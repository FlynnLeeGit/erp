import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

const index = r => require(['@/pages/index.vue'], r)
const login = r => require(['@/pages/login.vue'], r)

const quota = r => require(['@/pages/quota/index.vue'], r)
const artficial = r => require(['@/pages/quota/artficial/index.vue'], r)
const auxmaterial = r => require(['@/pages/quota/auxmaterial/index.vue'], r)
const quotaTpl = r => require(['@/pages/quota/quota/index.vue'], r)
const release = r => require(['@/pages/quota/release/index.vue'], r)

const purchase = r => require(['@/pages/purchase/index.vue'], r)
const supplier = r => require(['@/pages/purchase/supplier/index.vue'], r)
const material = r => require(['@/pages/purchase/material/index.vue'], r)

const account = r => require(['@/pages/account/index.vue'], r)
const accoutUsers = r => require(['@/pages/account/users.vue'], r)
const accountPassword = r => require(['@/pages/account/password.vue'], r)

const collects = r => require(['../pages/collects/index.vue'], r)

const projects = r => require(['../pages/projects/index.vue'], r)
const projectsPid = r => require(['../pages/projects/_pid/index.vue'], r)
const projectsPidBudgets = r =>
  require(['../pages/projects/_pid/budgets/index.vue'], r)
const projectsPidSpaces = r =>
  require(['../pages/projects/_pid/spaces/index.vue'], r)
const projectsPidBudgets_diff = r =>
  require(['../pages/projects/_pid/budgets_diff/index.vue'], r)
const projectsPidBudgetsBid = r =>
  require(['../pages/projects/_pid/budgets/_bid/index.vue'], r)
const projectsPidBudgetsBidItems = r =>
  require(['../pages/projects/_pid/budgets/_bid/items/index.vue'], r)
const projectsPidBudgetsBidStatistics = r =>
  require(['../pages/projects/_pid/budgets/_bid/statistics/index.vue'], r)

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
      path: 'budgets_diff',
      component: projectsPidBudgets_diff,
      name: 'projects-pid-budgets_diff'
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
