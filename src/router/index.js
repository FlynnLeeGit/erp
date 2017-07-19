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
import supply from '@/pages/purchase/supply/index.vue'
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
  meta: {
    title: '定额'
  },
  component: quota,

  children: [
    {
      path: 'artficial',
      name: 'quota.artficial',
      meta: {
        title: '定额人工费'
      },
      component: artficial
    },
    {
      path: 'auxmaterial',
      name: 'quota.auxmaterial',
      meta: {
        title: '定额辅材规格'
      },
      component: auxmaterial
    },
    {
      path: 'quota',
      name: 'quota.quota',
      meta: {
        title: '定额模版'
      },
      component: quotaTpl
    },
    {
      path: 'release',
      name: 'quota.release',
      meta: {
        title: '版本比对'
      },
      component: release
    }
  ]
}

const purchaseRoutes = {
  path: 'purchase',
  component: purchase,
  name: 'purchase',
  meta: {
    title: '采购管理'
  },
  children: [
    {
      path: 'supply',
      name: 'purchase.supply',
      meta: {
        title: '供应商管理'
      },
      component: supply
    },
    {
      path: 'material',
      name: 'purchase.material',
      meta: {
        title: '辅材采购管理'
      },
      component: material
    }
  ]
}

const accountRoutes = {
  path: 'account',
  name: 'account',
  meta: {
    title: '账号管理'
  },
  component: account,
  children: [
    {
      path: 'users',
      name: 'account.users',
      meta: {
        title: '用户列表'
      },
      component: accoutUsers
    },
    {
      path: 'password',
      name: 'account.password',
      meta: {
        title: '密码修改'
      },
      component: accountPassword
    }
  ]
}

const projectRoutes = {
  path: 'project',
  name: 'project',
  meta: {
    title: '项目'
  },
  component: project,
  children: [
    {
      path: 'list',
      name: 'project.list',
      meta: {
        title: ''
      },
      component: projectList
    },
    {
      path: 'collect',
      name: 'project.collect',
      meta: {
        title: '常用定额标注'
      },
      component: projectCollect
    },
    {
      path: ':pid/detail/budget/:bid/items',
      name: 'project.detail.budget.items',
      meta: {
        title: '预算定额列表'
      },
      component: projectDetailBudgetItems
    },
    {
      path: ':pid/detail',
      name: 'project.detail',
      meta: {
        title: '详情'
      },
      component: projectDetail,
      children: [
        {
          path: 'space',
          name: 'project.detail.space',
          meta: {
            title: ''
          },
          component: projectDetailSpace
        },
        {
          path: 'budget',
          name: 'project.detail.budget',
          meta: {
            title: ''
          },
          component: projectDetailBudget
        }
      ]
    }
  ]
}

const routes = [
  {
    path: '/',
    name: 'index',
    component: index,
    meta: {
      title: '首页'
    },
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
