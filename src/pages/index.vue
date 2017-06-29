<template>
  <el-row class="app-content">
    <el-col :span='sideSpan'
            class="app-side">
      <my-side @mini='sideMini'
               @normal='sideNormal'>
      </my-side>
    </el-col>
    <el-col :span='24 - sideSpan'
            class="app-main">
      <h3 class="app-route-name">{{$route.name}}</h3>
      <router-view>
      </router-view>
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
  data () {
    return {
      sideSpan: 3
    }
  },
  methods: {
    sideMini () {
      this.sideSpan = 1
    },
    sideNormal () {
      this.sideSpan = 4
    }
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


