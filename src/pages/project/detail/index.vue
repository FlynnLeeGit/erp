<template>
  <div v-loading='$isAjax.get_by_id'>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{name:'project.list'}">项目列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ currentProject.address }}-{{currentProject.houseType}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs type='card'
             class="_mt1"
             v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="预算管理"
                   name="project.detail.budget">
      </el-tab-pane>
      <el-tab-pane label="空间管理"
                   name="project.detail.space">
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
    ...mapGetters('project/list', ['currentProject', '$isAjax']),
    pid () {
      return this.$route.params.pid
    }
  },
  created () {
    this.get_by_id(this.pid)
  },
  methods: {
    ...mapActions('project/list', ['get_by_id']),
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


