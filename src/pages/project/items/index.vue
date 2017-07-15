<template>
  <div class="_rel">
    <div class="title-txt">
      项目:[{{$route.query.pname}}][{{$route.query.bname}}]
    </div>
  
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

export default {
  components: {
    budgetDetail,
    budgetStatistics
  },
  data () {
    return {
      currentView: 'budgetDetail'
    }
  }
}
</script>

<style lang="scss">
.title-txt {
  position: absolute;
  margin-top: -32px;
  margin-left: 121px;
}
</style>

