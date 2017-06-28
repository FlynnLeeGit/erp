<template>
  <el-dialog title='添加定额'
             :visible.sync='visible'>
    <el-form :model='row'>
      <el-form-item label='名称'
                    :label-width="formLabelWidth">
        <el-input placeholder='请输入定额名称'
                  v-model='row.name'></el-input>
      </el-form-item>
      <el-form-item label='分类'
                    :label-width="formLabelWidth">
        <el-select v-model='row.type'
                   @change="row.secType=''">
          <el-option :key='tKey'
                     v-for='(secTypeList,tKey) in map.type'
                     :value='tKey'>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if='row.type'
                    label='二级分类'
                    :label-width="formLabelWidth">
        <el-select v-model='row.secType'>
          <el-option :key='t'
                     v-for='t in map.type[row.type]'
                     :value='t'>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='单位'
                    :label-width="formLabelWidth">
        <el-select v-model='row.unit'>
          <el-option :key='u'
                     v-for='u in map.unit'
                     :value='u'>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='位置'
                    :label-width="formLabelWidth">
        <el-select v-model='row.position'>
          <el-option :key='p'
                     v-for='p in map.position'
                     :value='p'>
          </el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label='阶段'
                    :label-width="formLabelWidth">
        <el-select v-model='row.stage'>
          <el-option :key='s'
                     v-for='s in map.stage'
                     :value='s'>
          </el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label='工种'
                    :label-width="formLabelWidth">
        <el-select v-model='row.workType'>
          <el-option :key='w'
                     v-for='w in map.workType'
                     :value='w'>
          </el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label='损耗率'
                    :label-width="formLabelWidth">
        <el-input-number v-model='row.wastage'
                         :step='0.01'>
        </el-input-number>
      </el-form-item>
  
      <el-form-item label='说明'
                    :label-width="formLabelWidth">
        <el-input placeholder='请输入定额的说明'
                  type='textarea'
                  :rows='3'
                  v-model='row.description'>
        </el-input>
      </el-form-item>
      <el-form-item label='工作内容'
                    :label-width="formLabelWidth">
        <el-input placeholder='请输入定额的工作内容'
                  type='textarea'
                  :rows='5'
                  v-model='row.content'>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot='footer'
         class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button v-if='isAdd'
                 type="success"
                 :loading='isSubmiting'
                 @click="submitAdd(row)">
        添 加
      </el-button>
      <el-button v-if='isEdit'
                 type="info"
                 :loading='isSubmiting'
                 @click="submitEdit(row)">
        更新
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { add, edit } from './api'
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
        name: '',
        type: '',
        stage: '',
        secType: '',
        unit: '',
        workType: '',
        wastage: 0,
        position: '',
        quotaArtficialCounters: [],
        quotaAuxiliaryCounters: []
      },
      formLabelWidth: '80px',
      isSubmiting: false,
      opt: '',
      qRow: {}
    }
  },
  computed: {
    isAdd () {
      return this.opt === 'add'
    },
    isEdit () {
      return this.opt === 'edit'
    }
  },
  methods: {
    // 还原row为初始空内容状态
    restoreRow (originalRow) {
      this.row = Object.assign({}, originalRow)
    },
    submitAdd (data) {
      this.isSubmiting = true
      add(data)
        .then(({ data }) => {
          this.$message.success("添加成功")
          this.close()
          this.$emit('added', data)
        }).finally(() => {
          this.isSubmiting = false
        })
    },
    submitEdit (data) {
      this.isSubmiting = true
      edit(data)
        .then(({ data }) => {
          this.$message.success("更新成功")
          this.close()
          this.$emit('edited', this.qRow, data)
        }).finally(() => {
          this.isSubmiting = false
        })
    },
    open (opt, row) {
      this.opt = opt
      this.qRow = row
      if (this.isAdd) {
        this.restoreRow(this.initialRow)
      }
      if (this.isEdit) {
        this.restoreRow(row)
      }
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>


