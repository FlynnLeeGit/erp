<template>
  <el-dialog title='添加人工计量'
             :visible.sync='visible'
             label-width='80px'>
    <el-form :model='row'>
      <el-form-item label='模版ID'>
        <span>{{qRow.id}}</span>
      </el-form-item>
      <el-form-item label='工种'>
        <el-select v-model='row.quotaArtficial.id'>
          <el-option v-for='art in artList'
                     :key='art.id'
                     :label='art.workType'
                     :value='art.id'
                     :disabled="optionDisabled(qRow,art)">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='用量'>
        <el-input-number :debounce='1000'
                         :min='0'
                         v-model='row.counter'
                         :step='0.1'>
        </el-input-number>
        <span class="_ml1">[步进0.1]</span>
      </el-form-item>
    </el-form>
    <div slot='footer'
         class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="success"
                 :loading='$isAjax.create_artficial_count'
                 @click="submit(row)">
        添 加
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      visible: false,
      row: {
        quotaArtficial: {}
      },
      initialRow: {
        counter: 0,
        quotaArtficial: {
          id: ''
        }
      },

      qRow: {},
    }
  },
  computed: {
    ...mapGetters('quota/artficial', {
      artList: 'list'
    }),
    ...mapGetters('quota/quota', ['$isAjax'])
  },
  methods: {
    ...mapActions('quota/quota', ['create_artficial_count']),
    // 还原row为初始空内容状态
    optionDisabled (qRow, art) {
      return qRow.quotaArtficialCounters && this.$utils.valueInArray(qRow.quotaArtficialCounters, art.id, 'quotaArtficial.id')
    },
    restoreRow (qid) {
      this.row = this.$utils.deepCopy(this.initialRow)
    },
    submit (data) {
      this.create_artficial_count({
        qid: this.qRow.id,
        data
      }).then(() => {
        this.$message.success(`添加人工计量至 ${this.qRow.name} 成功`)
        this.close()
      })
    },
    open (qRow) {
      this.qRow = qRow
      this.restoreRow()
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>

