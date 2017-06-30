<template>
  <el-row class="app-content">
    <el-col v-if='!sideHide'
            :span='2'
            class="app-side">
      <my-side>
      </my-side>
    </el-col>
    <el-col :span='sideHide?24:22'
            class="app-main">
      <h4 class="app-route-name">{{$route.name}}</h4>
      <router-view>
      </router-view>
    </el-col>
  </el-row>
</template>
<script>
import axios from '@/plugins/axios'
import MySide from '@/components/MySide.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    MySide
  },
  computed: {
    ...mapGetters(['sideHide'])
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
    padding: 15px;
    overflow-y: auto;
  }
  &-route-name {
    margin-bottom: 10px;
  }
}
</style>


