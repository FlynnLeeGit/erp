<template>
  <div>
    <el-breadcrumb class="_mb2">
      <el-breadcrumb-item :to="{name:'项目列表'}">项目列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name:'预算管理',params:{pid:pid}}">
        {{currentProject.address}} 预算管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        预算明细
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="currentView"
             type="card">
      <el-tab-pane label="预算明细"
                   name="budgetDetail">
  
      </el-tab-pane>
      <el-tab-pane label="预算统计"
                   name="budgetStatistics">
  
      </el-tab-pane>
    </el-tabs>
  
    <keep-alive>
      <component :is="currentView">
      </component>
    </keep-alive>
  
  </div>
</template>
<script>
import budgetDetail from './detail/index.vue'
import budgetStatistics from './statistics/index.vue'

import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    budgetDetail,
    budgetStatistics
  },
  created () {
    this.init({
      pid: this.pid,
      bid: this.bid
    })
  },
  data () {
    return {
      currentView: 'budgetDetail'
    }
  },
  computed: {
    ...mapGetters('project/detail', ['currentProject']),
    pid () {
      return +this.$route.params.pid
    },
    bid () {
      return +this.$route.params.bid
    }
  },
  methods: {
    ...mapActions('project/items', ['init']),
  }
}
</script>

