<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>
        预算明细
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeName"
             type="card">
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
import { mapActions, mapGetters } from 'vuex'

export default {
  created () {

  },
  computed: {
    ...mapGetters('projects/_pid',['projectInfo']),
    pid () {
      return +this.$route.params.pid
    },
    bid () {
      return +this.$route.params.bid
    }
  }
}
</script>

