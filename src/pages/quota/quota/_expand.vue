<template>
  <div>
    <el-form lable-postion='left'
             inline
             class="table-expand -form">
      <el-form-item label='说明'
                    class="-block">
        <inline-edit :data='row'
                     prop='description'
                     :fn='update'
                     :direct-modify='false'
                     type='textarea'>
          <pre>{{row.description}}</pre>
        </inline-edit>
      </el-form-item>
      <el-form-item label='工作内容'
                    class="-block">
        <inline-edit :data='row'
                     prop='content'
                     :fn='update'
                     :direct-modify='false'
                     type='textarea'>
          <pre>{{row.content}}</pre>
        </inline-edit>
      </el-form-item>
    </el-form>
    <artficial :table-data='row.quotaArtficialCounters'
               :qid='row.id'>
    </artficial>
    <auxmaterial :table-data='row.quotaAuxiliaryCounters'
                 :qid='row.id'>
    </auxmaterial>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
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
    ...mapActions('quota/quota', ['update'])
  }
}
</script>


