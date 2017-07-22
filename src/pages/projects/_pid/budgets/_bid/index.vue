<template>
  <div>
    <el-breadcrumb class="_mb2">
      <el-breadcrumb-item :to="{name:'projects'}">
        项目列表
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{name:'projects-pid-budgets',params:{pid}}">
        {{projectInfo.address}} 预算管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{budgetInfo.name}} {{tabsMap[activeName]}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeName"
             type="card"
             @tab-click='tabClick'>
      <el-tab-pane v-for="tab in tabs"
                   :key="tab.name"
                   :label="budgetInfo.name + ' ' + tab.label"
                   :name="tab.name">
      </el-tab-pane>
    </el-tabs>
    <router-view>
    </router-view>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'

const tabs = [
  { label: '明细', name: 'projects-pid-budgets-bid-items', regex: /^\/projects(?:\/((?:[^\/]+?)))?\/budgets(?:\/((?:[^\/]+?)))?\/items(?:\/(?=$))?$/i },
  { label: '统计', name: 'projects-pid-budgets-bid-statistics', regex: /^\/projects(?:\/((?:[^\/]+?)))?\/budgets(?:\/((?:[^\/]+?)))?\/statistics(?:\/(?=$))?$/i },
]

export default {
  beforeRouteEnter (to, from, next) {
    let activeName = ''
    tabs.forEach(tab => {
      if (tab.regex.test(to.path)) {
        activeName = tab.name
      }
    })
    next(vm => {
      vm.activeName = activeName
    })
  },
  beforeRouteLeave (to, from, next) {
    this.SHOW_PID_TABS()
    next()
  },
  data () {
    return {
      tabs,
      activeName: ''
    }
  },
  metaInfo () {
    return {
      title: this.budgetInfo.name + ' ' + this.tabsMap[this.activeName]
    }
  },
  created () {
    this.HIDE_PID_TABS()
    this.init({
      pid: this.pid,
      bid: this.bid
    })
  },
  computed: {
    ...mapGetters('projects/_pid', ['projectInfo']),
    ...mapGetters('projects/_pid/budgets/_bid', ['budgetInfo']),
    tabsMap () {
      return this.$utils.listToMap(tabs, 'label', 'name')
    },
    pid () {
      return +this.$route.params.pid
    },
    bid () {
      return +this.$route.params.bid
    }
  },
  methods: {
    ...mapActions('projects/_pid/budgets/_bid', ['init']),
    ...mapMutations('projects/_pid', ['HIDE_PID_TABS', 'SHOW_PID_TABS']),
    tabClick (tab) {
      this.$router.replace({
        name: tab.name,
        params: this.$route.params
      })
    }
  }
}
</script>

