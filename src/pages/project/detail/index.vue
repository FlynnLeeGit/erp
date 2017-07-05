<template>
  <div>
    <el-button class="detail-back-btn"
               type='info'
               @click="$router.push({name:'project.list'})">
      返回
    </el-button>
    <el-tabs v-model="activeName"
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
        params: {
          pid
        }
      })
    }
  },
  created () {
    console.log(this.$route)
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


