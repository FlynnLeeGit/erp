<template>
  <el-card :class="cls">
    <div slot='header'>
      <el-row>
        <el-col :span="18">
          {{title}}
        </el-col>
        <el-col v-if="toTitle"
                :span="6"
                class="_tr">
          <el-button type='info'
                     class="-has-link"
                     size='small'>
            <router-link :to="to">
              {{toTitle}}
            </router-link>
          </el-button>
        </el-col>
      </el-row>
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
    },
    to: {
      type: null,
      default: ''
    },
    toTitle: {
      type: String,
      default: ''
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
    line-height: 1.4;
    .el-button.-has-link {
      padding: 0;
      a {
        color: #fff;
        display: block;
        padding: 7px 9px;
        text-decoration: none;
      }
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