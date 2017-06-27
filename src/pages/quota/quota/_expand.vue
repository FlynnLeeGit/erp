<template>
  <div>
    <el-form lable-postion='left'
             inline
             class="table-expand -form">
      <el-form-item label='分类'>
        <span>{{row.type}}</span>
      </el-form-item>
      <el-form-item label='二级分类'>
        <span>{{row.sec_type}}</span>
      </el-form-item>
      <el-form-item label='单位'>
        <span>{{row.unit}}</span>
      </el-form-item>
      <el-form-item label='位置'>
        <span>{{row.position}}</span>
      </el-form-item>
      <el-form-item label='阶段'>
        <span>{{row.stage}}</span>
      </el-form-item>
      <el-form-item label='工种'>
        <span>{{row.work_type}}</span>
      </el-form-item>
      <el-form-item label='损耗率'>
        <span>{{row.wastage}}</span>
      </el-form-item>
      <el-form-item label='说明'
                    class="-block">
        <span>{{row.description}}</span>
      </el-form-item>
      <el-form-item label='工作内容'
                    class="-block">
        <span>{{row.content}}</span>
      </el-form-item>
    </el-form>
    <artficial :table-data='row.quotaArtficialCounters' />
    <auxmaterial :table-data='row.quotaAuxiliaryCounters' />
  </div>
</template>
<script>
import artficial from './_artficial.vue'
import auxmaterial from './_auxmaterial.vue'

export default {
  components: {
    artficial,
    auxmaterial
  },
  props: {
    row: {
      type: Object,
      default: {}
    }
  }
}
</script>


