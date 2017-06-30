<template>
  <el-row>
    <el-col :span='12'>
      123
  
    </el-col>
    <el-col :span='12'>
  
      456
    </el-col>
  
  </el-row>
</template>
<script>
import { getVersionList, getLast, getByVersion } from './api'

export default {
  data () {
    return {
      prevTableData: [],

    }
  },

  created () {
    this.initData()
  },
  methods: {
    initData () {

    }
  }
}
</script>
