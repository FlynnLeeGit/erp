<template>
  <el-dialog title='添加辅材计量'
             :visible.sync='visible'>
    <el-form :model='row'>
      <el-form-item label='模版ID'
                    :label-width="formLabelWidth">
        <span>{{row.quotaTemplateId}}</span>
      </el-form-item>
      <el-form-item label='辅材名称'
                    :label-width="formLabelWidth">
        <el-select v-model='row.quotaAuxiliaryMaterialId'>
          <el-option :key='mat.id'
                     :label='mat.name'
                     v-for='mat in map.matList'
                     :value='mat.id'>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='辅材计量'
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
      row: {},
      initialRow: {
        quotaAuxiliaryMaterialId: 0,
        counter: 0,
      },
      formLabelWidth: '80px',
      isSubmiting: false,
      qRow: {},
    }
  },
  methods: {
    // 还原row为初始空内容状态
    restoreRow (qid) {
      this.row = Object.assign({ quotaTemplateId: qid }, this.initialRow)
    },
    submit (data) {
      this.isSubmiting = true
      addMat(data).then(({ data }) => {
        this.$message.success(`添加辅材计量至 ${this.qRow.name} 成功`)
        this.qRow.quotaAuxiliaryCounters.push(data)
        this.close()
        this.$emit('added')
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

