<template>
  <div>
    <el-form lable-postion='left'
             inline
             class="table-expand -form">
      <el-form-item label='说明'
                    class="-block">
        <inline-edit :data='row'
                     prop='description'
                     :fn='edit'
                     type='text'>
        </inline-edit>
      </el-form-item>
      <el-form-item label='工作内容'
                    class="-block">
        <inline-edit :data='row'
                     prop='content'
                     :fn='edit'
                     type='text'>
        </inline-edit>
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
import { edit } from './api'

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
    edit,
    updateQuota (newQuota) {
      this.$root.$emit('quota.quota.update', this.row, newQuota)
    }
  }
}
</script>


