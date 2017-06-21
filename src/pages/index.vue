<template>
  <el-row class="app-content">
    <el-col :span='4'
            class="app-side">
      <my-side />
    </el-col>
    <el-col :span='20'
            class="app-main">
      <h3 class="app-route-name">{{$route.name}}</h3>
      <router-view />
    </el-col>
  </el-row>
</template>
<script>
import axios from '@/plugins/axios'
import MySide from '@/components/MySide.vue'
export default {
  components: {
    MySide
  },
  mounted () {

    // $('#table_id_example').DataTable()
  }
}
</script>
<style lang="scss">
.app-content {
  height: 100%;
}

.app-side {
  height: 100%;
}

.app-main {
  padding: 25px;
}

.app-route-name {
  margin-bottom: 30px;
}
</style>


