<template>
  <div>
    <el-row :gutter="10"
            v-loading='isFetching'>
      <el-col :span='6'
              v-for='(b,index) in tableData'
              :key='b.id'>
        <card :title='b.name'
              type='default'>
          <el-button type='info'
                     slot='header-slot'
                     class="_fr"
                     size='small'>
            <router-link target='_blank'
                         :to="{name:'project.detail.budget.items',params:{pid:pid,bid:b.id}}">
              进入{{b.name}}
            </router-link>
          </el-button>
          {{b.description}}
          <p class='_mt1 _text'>
            劳务利润率 {{b.rateOfArtificialProfit * 100 }}%
            <br>公司利润率 {{b.rateOfCompanyProfit * 100 }}%
            <span class="_fr">
              <el-button @click.stop='handleEdit(b)'
                         type='text'
                         class="_p0">
                编辑
              </el-button>
              <el-button @click.stop='handleDelete(index,b)'
                         :loading='isDeleting && delId === b.id'
                         type='text'
                         class="_p0 _text-danger">
                删除
              </el-button>
            </span>
          </p>
        </card>
      </el-col>
      <el-col :span='6'>
        <card-plus style="height:140px;"
                   @click='handleAdd'>
        </card-plus>
      </el-col>
    </el-row>
  
    <!--dialog-->
    <el-dialog title='预算'
               :visible.sync='showDialog'>
      <el-form :model='row'
               label-width='100px'>
        <el-form-item label='名称'>
          <el-input placeholder='请输入预算名称'
                    v-model='row.name'></el-input>
        </el-form-item>
        <el-form-item label='说明'>
          <el-input placeholder='请输入该预算说明'
                    v-model='row.description'>
          </el-input>
        </el-form-item>
        <el-form-item label='劳务利润率'>
          <el-input-number placeholder='请输入劳务利润率'
                           :disabled="opt==='edit'"
                           :step='0.1'
                           :min='0'
                           v-model='row.rateOfArtificialProfit'>
          </el-input-number>
        </el-form-item>
        <el-form-item label='公司利润率'>
          <el-input-number placeholder='请输入公司利润率'
                           :disabled="opt==='edit'"
                           :min='0'
                           :step='0.1'
                           v-model='row.rateOfCompanyProfit'>
          </el-input-number>
        </el-form-item>
      </el-form>
      <div slot='footer'
           class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button v-if="opt==='add'"
                   type="success"
                   :loading='isSubmiting'
                   @click="submitAdd(row)">
          添 加
        </el-button>
        <el-button v-if="opt==='edit'"
                   type="primary"
                   :loading='isSubmiting'
                   @click="submitEdit(row)">
          更 新
        </el-button>
  
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get, edit, add, del } from './api'
export default {
  data () {
    return {
      tableData: [],
      map: {},
      isFetching: false,
      isDeleting: false,

      row: {},
      initialRow: {
        name: '',
        description: '',
        rateOfArtificialProfit: 0.1,
        rateOfCompanyProfit: 0.3
      },
      editRow: {},

      delId: 0,

      opt: 'add',
      showDialog: false,
      isSubmiting: false
    }
  },
  created () {
    this.initData()
  },
  computed: {
    pid () {
      return +this.$route.params.pid
    }
  },
  methods: {
    initData () {
      this.isFetching = true
      return Promise.all([get(this.pid)])
        .then(([one]) => {
          this.tableData = one.data
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    handleAdd () {
      this.opt = 'add'
      this.showDialog = true
      this.row = this.$utils.deepCopy(this.initialRow)
    },
    handleEdit (data) {
      this.opt = 'edit'
      this.showDialog = true
      this.editRow = data
      this.row = this.$utils.deepCopy(this.editRow)
    },
    handleDelete (index, row) {
      this.delId = row.id
      this.$confirm('确认删除？')
        .then(() => {
          this.isDeleting = true
          return del(this.pid, row.id)
        })
        .then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    submitAdd (row) {
      this.isSubmiting = true
      add(this.pid, row)
        .then(({ data }) => {
          this.$message.success('添加成功！')
          this.tableData.push(data)
          this.showDialog = false
        })
        .finally(() => {
          this.isSubmiting = false
        })
    },
    submitEdit (row) {
      this.isSubmiting = true
      edit(row)
        .then(({ data }) => {
          this.$message.success('更新成功！')
          this.$utils.replaceObjectFields(this.editRow, data)
          this.showDialog = false
        })
        .finally(() => {
          this.isSubmiting = false
        })
    },
    cancelDialog () {
      this.showDialog = false
    }
  }
}

</script>

