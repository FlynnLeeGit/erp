<template>
  <el-dialog title='添加辅材计量'
             :visible.sync='visible'
             label-width="80px">
    <el-form :model='row'>
      <el-form-item label='模版ID'>
        <span>{{qRow.id}}</span>
      </el-form-item>
      <el-form-item label='辅材名称'>
        <el-select v-model='row.quotaAuxiliaryMaterial.id'>
          <el-option :key='mat.id'
                     :label='mat.name'
                     v-for='mat in map.matList'
                     :value='mat.id'
                     :disabled="optionDisabled(qRow,mat)">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='辅材计量'>
        <el-input-number v-model='row.counter'
                         :debounce='800'
                         :min='0'
                         :step='0.1'>
        </el-input-number>
        <span class="_ml1">[步进0.1]</span>
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
import { addMat } from './api'

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
        quotaAuxiliaryMaterial: {}
      },
      initialRow: {
        counter: 0,
        quotaAuxiliaryMaterial: {
          id: ''
        }
      },
      isSubmiting: false,
      qRow: {},
    }
  },
  methods: {
    // 还原row为初始空内容状态
    restoreRow (qid) {
      this.row = this.$utils.deepCopy(this.initialRow)
    },
    optionDisabled (qRow, mat) {
      return qRow.quotaAuxiliaryCounters && this.$utils.valueInArray(qRow.quotaAuxiliaryCounters, mat.id, 'quotaAuxiliaryMaterial.id')
    },
    submit (data) {
      this.isSubmiting = true
      addMat(this.qRow.id, data).then(({ data }) => {
        this.$message.success(`添加辅材计量至 ${this.qRow.name} 成功`)
        this.close()
        this.$root.$emit('quota.quota.update', this.qRow, data)
      }).finally(() => {
        this.isSubmiting = false
      })
    },
    open (qRow) {
      this.qRow = qRow
      this.restoreRow(qRow.id)
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>

