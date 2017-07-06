<template>
  <div>
    <el-button class="detail-back-btn"
               type='info'
               @click="$router.push({name:'project.list'})">
      返回
    </el-button>
    <el-alert show-icon
              title='项目地址'
              :description='$route.query.name'></el-alert>
    <el-tabs class="_mt1"
             type='card'
             v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="空间管理"
                   name="project.detail.space">
      </el-tab-pane>
      <el-tab-pane label="预算管理"
                   name="project.detail.budget">
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
      activeName: this.$route.name
    }
  },
  methods: {
    handleClick (tab) {
      const pid = this.$route.params.pid
      this.$router.push({
        name: tab.name,
        params: this.$route.params,
        query: this.$route.query
      })
    }
  }
}
</script>
<style>
.detail-back-btn {
  position: absolute;
  margin-top: -54px;
  margin-left: 90px;
}
</style>


