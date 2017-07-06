<template>
  <div>
    <el-cascader v-model='selectedCollect'
                 :options="collectOptions"
                 filterable
                 :show-all-levels="false"
                 placeholder="可以搜索">
  
    </el-cascader>

  </div>
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

