<template>
  <el-menu class="app-menu"
           :router='true'>
    <template>
      <el-menu-item-group title="定额管理">
        <el-menu-item index="/quota/artficial">人工管理</el-menu-item>
        <el-menu-item index="/quota/auxmaterial">辅材规格</el-menu-item>
        <el-menu-item index="/quota/quota">定额模版</el-menu-item>
        <el-menu-item index="/quota/release">版本</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="采购管理">
        <el-menu-item index="/purchase/supply">供应商管理</el-menu-item>
        <el-menu-item index="/purchase/material">辅材管理</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="账号管理">
        <el-menu-item index="/account/users">用户列表</el-menu-item>
        <el-menu-item index="/account/password">密码修改</el-menu-item>
      </el-menu-item-group>
    </template>
  </el-menu>
</template>
<style lang='scss'>
.app-menu {
  height: 100%;
}
</style>



