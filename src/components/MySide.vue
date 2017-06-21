<template>
  <el-menu class="app-menu"
           :router='true'
           @open="handleOpen"
           @close="handleClose">
    <el-submenu index="1">
      <template slot="title">
        定额
      </template>
      <el-menu-item index="/quota/artficial">人工管理</el-menu-item>
      <el-menu-item index="/quota/auxmaterial">辅材管理</el-menu-item>
      <el-menu-item index="/quota/artficialcounter">人工计量</el-menu-item>
      <el-menu-item index="/quota/auxmaterialcounter">辅材计量</el-menu-item>
    </el-submenu>
    <el-menu-item index="/users">
      <i class="el-icon-menu"></i>
      人员管理
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>
<style lang='scss'>
.app-menu {
  height: 100%;
}
</style>



