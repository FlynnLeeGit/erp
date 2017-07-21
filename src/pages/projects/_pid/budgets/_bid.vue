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
        预算明细
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeName"
             type="card"
             @tab-click='tabClick'>
      <el-tab-pane label="预算明细"
                   name="projects-pid-budgets-bid-items">
  
      </el-tab-pane>
      <el-tab-pane label="预算统计"
                   name="projects-pid-budgets-bid-statistics">
  
      </el-tab-pane>
    </el-tabs>
  
    <router-view>
  
    </router-view>
  
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'

const tabs = [
  { label: '预算明细', name: 'projects-pid-budgets-bid-items', regex: /^\/projects(?:\/((?:[^\/]+?)))?\/budgets(?:\/((?:[^\/]+?)))?\/items(?:\/(?=$))?$/i },
  { label: '预算统计', name: 'projects-pid-budgets-bid-statistics', regex: /^\/projects(?:\/((?:[^\/]+?)))?\/budgets(?:\/((?:[^\/]+?)))?\/statistics(?:\/(?=$))?$/i },
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
      activeName: ''
    }
  },
  created () {
    this.HIDE_PID_TABS()
  },
  computed: {
    ...mapGetters('projects/_pid', ['projectInfo']),
    pid () {
      return +this.$route.params.pid
    },
    bid () {
      return +this.$route.params.bid
    }
  },
  methods: {
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

