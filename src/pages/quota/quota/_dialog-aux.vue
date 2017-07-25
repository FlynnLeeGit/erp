<template>
  <el-dialog title='添加辅材计量'
             :visible.sync='visible'>
    <el-form ref='form'
             :model='row'
             label-width="80px">
      <el-form-item label='模版ID'>
        <span>{{qRow.id}}</span>
      </el-form-item>
  
      <el-form-item v-if="visible"
                    label='辅材选择'>
        <el-cascader :options="cascaderOpts"
                     placeholder="级联选择规格与型号"
                     v-model="auxModel">
        </el-cascader>
      </el-form-item>
  
      <el-form-item label='用量'>
        <el-input-number v-model='row.counter'
                         :debounce='1000'
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
                 :loading='$isAjax.create_auxmaterial_count'
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
        quotaAuxiliaryMaterialSpec: {
          id: ''
        }
      },
      initialRow: {
        counter: 0,
        brand: '',
        model: '',
        quotaAuxiliaryMaterialSpec: {
          id: ''
        }
      },
      qRow: {
        quotaAuxiliaryCounters: []
      },
      auxModel: ['', '', '', '', '']
    }
  },
  computed: {
    ...mapGetters('purchase/material', ['brandOpts', 'modelOpts']),
    ...mapGetters('quota/auxmaterial', ['typeOpts', 'auxOpts', 'specOpts']),
    ...mapGetters('quota/quota', ['$isAjax']),
    cascaderOpts () {
      const cloneAuxOpts = this.$utils.deepCopy(this.auxOpts)
      // 将已经存在的材料计量禁用
      cloneAuxOpts.forEach(aux => {
        aux.disabled = this.$utils.valueInArray(this.qRow.quotaAuxiliaryCounters, aux.value, 'quotaAuxiliaryMaterial.id')
      })
      return this.$utils.toCascader(this.typeOpts, cloneAuxOpts, this.specOpts, this.brandOpts, this.modelOpts)
    }
  },
  methods: {
    ...mapActions('quota/quota', ['create_auxmaterial_count']),
    // 还原row为初始空内容状态
    reset () {
      this.row = this.$utils.deepCopy(this.initialRow)
      this.auxModel = ['', '', '', '', '']
    },
    submit (data) {
      this.$refs.form.validate(valid => {
        if (valid) {
          data.quotaAuxiliaryMaterialSpec.id = this.auxModel[2]
          data.brand = this.auxModel[3]
          data.model = this.auxModel[4]
          this.create_auxmaterial_count({
            qid: this.qRow.id,
            data
          }).then(() => {
            this.$message.success(`添加辅材计量至 ${this.qRow.name} 成功`)
            this.close()
          })
        }
      })
    },
    open (qRow) {
      this.qRow = qRow
      this.reset()
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>

