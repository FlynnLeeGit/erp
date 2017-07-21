<template>
  <div>
    项目详情 {{projectInfo.name}}
    <el-tabs>
      <el-tab-pane label="预算管理" name="tests.budget"></el-tab-pane>
      <el-tab-pane label="空间管理" name="tests.space"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.projectInfo = {
        name: '测试'
      }
    })
  },
  data () {
    return {
      projectInfo: {}
    }
  }
}
</script>

