<template>
  <el-dialog title='添加人工计量'
             :visible.sync='visible'>
    <el-form :model='row'>
      <el-form-item label='模版ID'
                    :label-width="formLabelWidth">
        <span>{{qRow.id}}</span>
      </el-form-item>
      <el-form-item label='人工工种'
                    :label-width="formLabelWidth">
        <el-select v-model='row.quotaArtficial.id'>
          <el-option v-for='art in map.artList'
                     :key='art.id'
                     :label='art.workType'
                     :value='art.id'
                     :disabled="optionDisabled(qRow,art)">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='人工计量'
                    :label-width="formLabelWidth">
        <el-input-number v-model='row.counter'
                         :step='0.1'>
        </el-input-number>
      </el-form-item>
    </el-form>
    <div slot='footer'
         class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="success"
                 :loading='isSubmiting'
                 @click="submit(row)">
        添 加
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addArt } from './api'
import { deepCopy, valueInArray } from '@/plugins/utils'
export default {
  props: {
    map: {
      type: Object,
      default: {}
    }
  },
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
      formLabelWidth: '80px',
      isSubmiting: false,
      qIndex: -1,
      qRow: {},
    }
  },
  methods: {
    valueInArray,
    // 还原row为初始空内容状态
    optionDisabled (qRow, art) {
      return qRow.quotaArtficialCounters && valueInArray(qRow.quotaArtficialCounters, art.id, 'quotaArtficial.id')
    },
    restoreRow (qid) {
      this.row = deepCopy(this.initialRow)
    },
    submit (data) {
      this.isSubmiting = true
      addArt(this.qRow.id, data).then(({ data }) => {
        this.$message.success(`添加人工计量至 ${this.qRow.name} 成功`)
        this.close()
        this.$root.$emit('quota.quota.update', this.qRow, data)
      }).finally(() => {
        this.isSubmiting = false
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

