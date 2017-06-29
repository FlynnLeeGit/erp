<template>
  <el-menu class="app-menu"
           :router='true'>
    <el-tag v-if='isNormal'
            @click.native='sideMini'
            class="_fr _pointer"
            type='primary'
            size='small'>
      收起
    </el-tag>
    <el-tag v-if='isMini'
            @click.native='sideNormal'
            class="_fr _pointer"
            type='primary'
            size='small'>
      展开
    </el-tag>
    <template v-if='isNormal'>
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
    </template>
  </el-menu>
</template>
<script>
export default {
  data () {
    return {
      mode: 'normal'
    }
  },
  computed: {
    isNormal () {
      return this.mode === 'normal'
    },
    isMini () {
      return this.mode === 'mini'
    }
  },
  methods: {
    sideMini () {
      this.$root.$emit('MySide:mode.mini')
    },
    sideNormal () {
      this.$root.$emit('MySide:mode.normal')
    }
  },
  created () {
    this.$root.$on('MySide:mode.mini', () => {
      this.mode = 'mini'
      this.$emit('mini')
    })
    this.$root.$on('MySide:mode.normal', () => {
      this.mode = 'normal'
      this.$emit('normal')
    })
  }
}
</script>
<style lang='scss'>
.app-menu {
  height: 100%;
}
</style>



