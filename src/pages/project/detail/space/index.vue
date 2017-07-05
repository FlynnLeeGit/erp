<template>
  <div>
    <el-row>
      <el-button type='success'
                 size='small'
                 @click='handleAdd'>
        添加空间
      </el-button>
    </el-row>
  
    <el-row :gutter="10"
            class="_mt1"
            v-loading='isFetching'>
      <el-col :span='6'
              v-for='(s,index) in tableData'
              :key='s.id'>
        <card :title='s.name'
              type='default'>
          <p class='_mt1 _text'>
            创建于:{{$utils.toLocaleString(s.createdAt)}}
            <span class="_fr">
              <el-button @click.stop='handleEdit(s)'
                         type='text'
                         class="_p0">
                编辑
              </el-button>
              <el-button @click.stop='handleDelete(index,s)'
                         :loading='isDeleting && delId === s.id'
                         type='text'
                         class="_p0 _text-danger">
                删除
              </el-button>
            </span>
          </p>
        </card>
      </el-col>
    </el-row>
  
    <!--dialog-->
    <el-dialog title='空间'
               :visible.sync='showDialog'>
      <el-form :model='row'
               label-width='80px'>
        <el-form-item label='空间'>
          <el-input placeholder='请输入空间名称'
                    v-model='row.name'></el-input>
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
        name: ''
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
      return this.$route.params.pid
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



