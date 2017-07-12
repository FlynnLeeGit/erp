<template>
  <el-row>
    <el-col :span='1'>
      123
    </el-col>
    <el-col :span='23'>
  
      <el-cascader v-model='selectedCollect'
                   :options="collectOptions"
                   filterable
                   :show-all-levels="false"
                   placeholder="可以搜索">
  
      </el-cascader>
    </el-col>
  
  </el-row>
</template>
<script>
import { get, getCollects } from './api'
import { generateOptions } from './helpers'

export default {
  data () {
    return {
      collectOptions: [],
      selectedCollect: ['', '']
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      Promise.all([getCollects()])
        .then(([two]) => {
          this.collectOptions = generateOptions(two.data)
        })
    }
  }
}
</script>
