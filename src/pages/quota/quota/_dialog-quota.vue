<template>
  <el-dialog title='添加定额'
             :visible.sync='visible'>
    <el-form ref='form'
             :model='row'
             label-width="80px"
             :rules='formRules'>
      <el-form-item prop='name'
                    label='名称'>
        <el-input placeholder='请输入定额名称'
                  v-model='row.name'></el-input>
      </el-form-item>
      <el-form-item prop='brand'
                    label='品牌'>
        <el-input placeholder='请输入品牌'
                  v-model='row.brand'></el-input>
      </el-form-item>
      <el-form-item label='分类'
                    prop='type'>
        <el-select v-model='row.type'
                   @change="row.secType=''">
          <el-option :key='tKey'
                     v-for='(secTypeList,tKey) in map.type'
                     :value='tKey'>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if='row.type'
                    prop='secType'
                    label='二级分类'>
        <el-select v-model='row.secType'>
          <el-option :key='t'
                     v-for='t in map.type[row.type]'
                     :value='t'>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='单位'
                    prop='unit'>
        <el-select v-model='row.unit'>
          <el-option :key='u'
                     v-for='u in map.unit'
                     :value='u'>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='位置'
                    prop='position'>
        <el-select v-model='row.position'>
          <el-option :key='p'
                     v-for='p in map.position'
                     :value='p'>
          </el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label='阶段'
                    prop='stage'>
        <el-select v-model='row.stage'>
          <el-option :key='s'
                     v-for='s in map.stage'
                     :value='s'>
          </el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label='工种'
                    prop='workType'>
        <el-select v-model='row.workType'>
          <el-option :key='w'
                     v-for='w in map.workType'
                     :value='w'>
          </el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label='损耗率'>
        <el-input-number v-model='row.wastage'
                         :min='0'
                         :debounce="800"
                         :step='0.01'>
  
        </el-input-number>
        <span class="_ml1">[步进0.01]</span>
      </el-form-item>
  
      <el-form-item label='说明'>
        <el-input placeholder='请输入定额的说明'
                  type='textarea'
                  :rows='3'
                  v-model='row.description'>
        </el-input>
      </el-form-item>
      <el-form-item label='工作内容'>
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
      <el-button type="success"
                 :loading='isSubmiting'
                 @click="submitAdd(row)">
        添 加
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
        brand: '',
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
      isSubmiting: false,
      formRules: {
        // name: [
        //   { required: true, message: '定额名称不能为空' }
        // ],
        // type: [
        //   { required: true, message: '类型不能为空' }
        // ],
        // secType: [
        //   { required: true, message: '二级分类不能为空' }
        // ],
        // unit: [
        //   { required: true, message: '单位不能为空' }
        // ],
        // stage: [
        //   { required: true, message: '阶段不能为空' }
        // ],
        // position: [
        //   { required: true, message: '位置不能为空' }
        // ],
        // workType: [
        //   { required: true, message: '工种不能为空' }
        // ]
      }
    }
  },
  methods: {
    // 还原row为初始空内容状态
    restoreRow (originalRow) {
      this.row = Object.assign({}, originalRow)
    },
    formValidate () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject('form valid failure')
          }
        })
      })
    },
    submitAdd (data) {
      this.formValidate().then(() => {
        this.isSubmiting = true
        add(data)
          .then(({ data }) => {
            this.$message.success("添加成功")
            this.close()
            this.$emit('added', data)
          }).finally(() => {
            this.isSubmiting = false
          })
      })
    },
    open () {
      this.restoreRow(this.initialRow)
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>


