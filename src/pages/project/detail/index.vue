<template>
  <div>
    <el-breadcrumb class="_mb2">
      <el-breadcrumb-item :to="{name:'项目列表'}">项目列表</el-breadcrumb-item>
      <el-breadcrumb-item>
        {{currentProject.address}} 
        {{activeName}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs type='card'
             class="_mt1"
             v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane name="预算管理"
                   label="预算管理">
      </el-tab-pane>
      <el-tab-pane name="空间管理"
                   label="空间管理">
      </el-tab-pane>
    </el-tabs>
    <router-view>
    </router-view>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      activeName: this.$route.name
    }
  },
  computed: {
    ...mapGetters('project/detail', ['currentProject']),
    pid () {
      return this.$route.params.pid
    },
  },
  created () {
    this.get_by_id(this.pid)
  },
  methods: {
    ...mapActions('project/detail', ['get_by_id']),
    handleClick (tab) {
      this.$router.push({
        name: tab.name,
        params: this.$route.params
      })
    }
  }
}
</script>
<style lang='scss'>
.detail-back {
  position: absolute;
  margin-top: -40px;
  margin-left: 90px;
}
</style>


