<template>
  <div id="app">
    <section class="app__hd">
      <div container>
        <el-row>
          <el-col :span='18'>
            <h2>中孚管理系统</h2>
          </el-col>
          <el-col v-if='user'
                  :span='6'
                  class="_tr">
            <span>你好,{{user.name}}</span>
            <el-button @click='logout'
                       type='primary'>登出</el-button>
          </el-col>
        </el-row>
        <h2></h2>
  
      </div>
  
    </section>
    <section class="app__bd">
      <router-view />
    </section>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['logout'])
  }
}
</script>

<style lang='scss'  src='./App.scss'></style>
<style lang='scss' src='./style/global.scss'></style>
<style lang='scss'  src='./style/helper.scss'></style>

