<template>
  <el-menu class="app-menu"
           :router='true'
           @open="handleOpen"
           @close="handleClose">
    <el-menu-item-group title="定额管理">
      <el-menu-item index="/quota/artficial">人工管理</el-menu-item>
      <el-menu-item index="/quota/auxmaterial">辅材规格</el-menu-item>
      <el-menu-item index="/quota/quota">定额模版</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="采购管理">
      <el-menu-item index="/purchase/supply">供应商管理</el-menu-item>
      <el-menu-item index="/purchase/material">辅材管理</el-menu-item>
    </el-menu-item-group>
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



