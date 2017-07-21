<template>
  <div>
    <router-link :to="{name:'tests'}">返回</router-link>
    项目详情 {{pid}} {{projectInfo.address}}
    <el-tabs v-model="activeTab"
             @tab-click='tabClick'>
      <el-tab-pane label="预算管理"
                   name="tests-budget">
      </el-tab-pane>
      <el-tab-pane label="空间管理"
                   name="tests-space">
      </el-tab-pane>
    </el-tabs>
    <router-view>
  
    </router-view>
  </div>
</template>
<script>
export default {
  data () {
    return {
      projectInfo: {

      },
      activeTab: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    let activeTab = ''
    const budgetReg = /^\/tests\/((?:[^\/]+?))\/budget(?:\/(?=$))?$/i
    const spaceReg = /^\/tests\/((?:[^\/]+?))\/space(?:\/(?=$))?$/i
    if (spaceReg.test(to.path)) {
      activeTab = 'tests-space'
    }
    if (budgetReg.test(to.path)) {
      activeTab = 'tests-budget'
    }
    console.log(to.params.pid)
    setTimeout(() => {
      next(vm => {
        vm.activeTab = activeTab
        vm.projectInfo = {
          address:'金平路777弄186号501'
        }
      })
    }, 200)
  },
  methods: {
    tabClick (tab) {
      this.$router.replace({
        name: tab.name,
        pid: this.pid
      })
    }
  },
  computed: {
    pid () {
      return +this.$route.params.pid
    },

  }
}
</script>

