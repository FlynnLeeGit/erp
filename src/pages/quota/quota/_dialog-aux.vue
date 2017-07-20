<template>
  <el-dialog title='添加辅材计量'
             :visible.sync='visible'>
    <el-form ref='form'
             :model='row'
             label-width="80px"
             :rules='formRules'>
      <el-form-item label='模版ID'>
        <span>{{qRow.id}}</span>
      </el-form-item>
  
      <el-form-item label='辅材品牌'
                    prop='brand'>
        <el-select v-model="row.brand"
                   @change="handleBrandChange"
                   placeholder="选择品牌">
          <el-option v-for="(modelList,brand) in matGroupList"
                     :key="brand"
                     :value="brand">
          </el-option>
        </el-select>
  
      </el-form-item>
  
      <el-form-item label="型号"
                    prop="model">
        <el-select v-if="row.brand"
                   placeholder="选择型号"
                   v-model="row.model">
          <el-option v-for="m in matGroupList[row.brand]"
                     :key="m.id"
                     :disabled="modelOptionsDisabled(m)"
                     @click.native="handleClickModel(m)"
                     :value="m.model">
          </el-option>
        </el-select>
        <span v-else
              class="_text">请先选择品牌</span>
      </el-form-item>
  
      <el-form-item label='用量'>
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
                 :loading='$isAjax.CREATE_AUXMATERIAL_COUNT'
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
        quotaAuxiliaryMaterial: {}
      },
      initialRow: {
        counter: 0,
        brand: '',
        model: '',
        quotaAuxiliaryMaterial: {}
      },
      qRow: {},
      formRules: {
        brand: [
          { required: true, message: '品牌不能为空' }
        ],
        model: [
          { required: true, message: '型号不能为空' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('purchase/material', {
      matGroupList: 'groupList'
    }),
    ...mapGetters('quota/quota', ['$isAjax'])
  },
  methods: {
    ...mapActions('quota/quota', ['create_auxmaterial_count']),
    // 还原row为初始空内容状态
    restoreRow () {
      this.row = this.$utils.deepCopy(this.initialRow)
    },
    modelOptionsDisabled (m) {
      m.disabled = this.$utils.valueInArray(this.qRow.quotaAuxiliaryCounters, m.quotaAuxiliaryMaterialId, 'quotaAuxiliaryMaterial.id')
      return m.disabled
    },
    submit (data) {
      this.$refs.form.validate(valid => {
        if (valid) {
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
      this.restoreRow()
      this.visible = true
    },
    close () {
      this.visible = false
    },
    handleBrandChange (brand) {
      this.row.model = ''
      this.row.quotaAuxiliaryMaterial.id = ''
    },
    handleClickModel (model) {
      this.row.quotaAuxiliaryMaterial.id = model.quotaAuxiliaryMaterialId
    }
  }
}
</script>

