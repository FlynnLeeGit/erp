<template>
  <div id="app">
    <section class="app__hd">
      <div container>
        <el-row>
          <el-col :span='18'>
            <h2>
              <el-tooltip content='切换侧边栏显示'>
                <i class="fa fa-list _pointer"
                   @click='TOGGLE_SIDE_HIDE'></i>
              </el-tooltip>
              中孚空间OA系统
            </h2>
          </el-col>
          <el-col v-if='user'
                  :span='6'
                  class="_tr">
            <span>你好,{{user.name}}</span>
            <el-button @click='logout($route.fullPath)'
                       type='primary'>
              登出
            </el-button>
          </el-col>
        </el-row>
      </div>
    </section>
    <section class="app__bd">
      <router-view>
      </router-view>
    </section>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['logout']),
    ...mapMutations(['TOGGLE_SIDE_HIDE']),
  }
}
</script>

<style lang='scss'  src='./App.scss'></style>
<style lang='scss' src='./style/global.scss'></style>
<style lang='scss'  src='./style/helper.scss'></style>

