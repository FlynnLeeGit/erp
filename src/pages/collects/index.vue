<template>
  <div>
    <el-alert title='将常用的定额打上标签，方便您日后预算制作时的选取'></el-alert>
    <collect-table editer-mode>
    </collect-table>
  </div>
</template>
<script>
import collectTable from './_collectTable.vue'
export default {
  components: {
    collectTable
  }
}
</script>


