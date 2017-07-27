<template>
  <div>
    <section v-show="showPidTabs">
      <el-breadcrumb class="_mb2">
        <el-breadcrumb-item :to="{name:'projects'}">项目列表</el-breadcrumb-item>
        <el-breadcrumb-item>
          {{projectInfo.address}} {{tabsMap[activeName]}}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-tabs type='card'
               class="_mt1"
               v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane v-for="tab in tabs"
                     :key="tab.name"
                     :label='tab.label'
                     :name="tab.name">
        </el-tab-pane>
      </el-tabs>
    </section>
  
    <router-view>
    </router-view>
  
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'


const tabs = [
  { label: '预算管理', name: 'projects-pid-budgets', regex: /^\/projects(?:\/((?:[^\/]+?)))?\/budgets(?:\/(?=$))?$/i },
  { label: '预算比对', name: 'projects-pid-budgets_diff', regex: /^\/projects(?:\/((?:[^\/]+?)))?\/budgets_diff(?:\/(?=$))?$/i },
  { label: '空间管理', name: 'projects-pid-spaces', regex: /^\/projects(?:\/((?:[^\/]+?)))?\/spaces(?:\/(?=$))?$/i }
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
  data () {
    return {
      activeName: '',
      tabs
    }
  },
  computed: {
    ...mapGetters('projects/_pid', ['projectInfo', 'showPidTabs']),
    tabsMap () {
      return this.$utils.listToMap(tabs, 'label', 'name')
    },
    pid () {
      return this.$route.params.pid
    },
  },
  metaInfo () {
    return {
      title: `${this.projectInfo.address}-${this.tabsMap[this.activeName]}`
    }
  },
  created () {
    this.get_by_id(this.pid)
  },
  methods: {
    ...mapMutations('project/_pid', ['SHOW_PID_TABS']),
    ...mapActions('projects/_pid', ['get_by_id']),
    handleClick (tab) {
      this.$router.replace({
        name: tab.name,
        params: this.$route.params
      })
    }
  }
}
</script>


