<template>
  <el-input @input='syncSearchField'
            style="width:180px"
            :icon='searchLoading'
            placeholder='全表搜索'>
  </el-input>
</template>
<script>
export default {
  methods: {
    syncSearchField (newVal) {
      
    }
  }
}
</script>

