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
.app {
  &-content,
  &-side,
  &-main {
    height: 100%;
  }
  &-main {
    padding: 25px;
    overflow-y: auto;
  }
  &-route-name {
    margin-bottom: 30px;
  }
}
</style>


