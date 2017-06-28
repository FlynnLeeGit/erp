<template>
  <div>
    <el-form lable-postion='left'
             inline
             class="table-expand -form">
      <el-form-item label='分类'>
        <span>{{row.type}}</span>
      </el-form-item>
      <el-form-item label='二级分类'>
        <span>{{row.secType}}</span>
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
        <span>{{row.workType}}</span>
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
    <artficial :table-data='row.quotaArtficialCounters'
               :qid='row.id'
               @update='updateQuota'>
    </artficial>
    <auxmaterial :table-data='row.quotaAuxiliaryCounters'
                 :qid='row.id'
                 @update='updateQuota'>
    </auxmaterial>
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
    },
  },
  methods: {
    updateQuota (newQuota) {
      this.$root.$emit('quota.quota.update', this.row, newQuota)
    }
  }
}
</script>


