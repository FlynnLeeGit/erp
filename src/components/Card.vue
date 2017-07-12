<template>
  <el-card :class="cls">
    <div slot='header'>
      {{title}}
      <slot name='header-slot'>
      </slot>
    </div>
    <slot></slot>
  </el-card>
</template>
<script>
export default {
  name: 'Card',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    title: {
      type: String,
      default: 'Title Here'
    }
  },
  computed: {
    cls () {
      return `Card -${this.type}`
    }
  }
}
</script>
<style lang='scss'>
.Card {
  margin-bottom: 6px;
  .el-card__header {
    color: #fff;
    a {
      color: #fff;
      text-decoration: none;
    }
  }
  .el-card__body {
    padding: 10px 20px;
    font-size: 13px;
  }

  &.-default .el-card__header {
    background-color: #8492A6;
  }
  &.-primary .el-card__header {
    background-color: #20A0FF;
  }
  &.-success .el-card__header {
    background-color: #13CE66;
  }
  &.-warning .el-card__header {
    background-color: #F7BA2A;
  }
  &.-danger .el-card__header {
    background-color: #FF4949;
  }
}
</style>