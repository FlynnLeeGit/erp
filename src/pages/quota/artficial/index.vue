<template>
  <div>
    <el-button @click='handleAdd()'
               type='primary'>
      添加
    </el-button>
    <el-input class="_fr"
              v-model='searchField'
              style="width:180px"
              placeholder='全表搜索'>
    </el-input>
    <el-table v-loading='isFetching || isDeleting'
              :data="sliceTableData"
              border
              class="_mt2"
              :default-sort="{prop: 'id'}"
              style="width: 100%">
      <el-table-column label="＃"
                       sortable
                       fixed
                       prop='id'
                       width="80">
      </el-table-column>
      <el-table-column label="工种"
                       sortable
                       prop='workType'
                       width="180">
      </el-table-column>
      <el-table-column label="价格(元)"
                       prop='price'
                       sortable
                       width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!--pagination-->
    <el-pagination class="_mt2"
                   :page-sizes='[10,30,50]'
                   :total='tableData.length'
                   :current-page="currentPage"
                   layout='total,sizes,prev,pager,next,jumper'
                   :page-size='pageSize'
                   @current-change='handleCurrentChange'
                   @size-change='handleSizeChange'>
    </el-pagination>
  
    <!--dialog-->
    <el-dialog title='添加人工'
               :visible.sync='showDialog'>
      <el-form :model='row'>
        <el-form-item v-if="opt==='edit'"
                      label='id'
                      :label-width="formLabelWidth">
          {{row.id}}
        </el-form-item>
        <el-form-item label='工种'
                      :label-width="formLabelWidth">
          <el-input placeholder='请输入工种'
                    v-model='row.workType'></el-input>
        </el-form-item>
        <el-form-item label='价格'
                      :label-width="formLabelWidth">
          <el-input-number v-model='row.price'
                           :step='10'>
          </el-input-number>
          <span class="_ml2">元</span>
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
                   type='primary'
                   :loading='isSubmiting'
                   @click='submitEdit(row)'>
          更 新
        </el-button>
      </div>
    </el-dialog>
  
  </div>
</template>

<script>
import { get, add, edit, del } from './api'

export default {
  data () {
    return {
      // table
      tableData: [],
      row: {},
      initialRow: {
        workType: '',
        price: 0
      },
      isFetching: false,
      isDeleting: false,
      // dialog
      isSubmiting: false,
      showDialog: false,
      formLabelWidth: '80px',
      opt: 'add',

      // pagination
      currentPage: 1,
      pageSize: 10,

      // search
      searchField: ''
    }
  },
  created () {
    this.fecthData()
  },
  computed: {
    sliceTableData () {
      return this.filterTableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    filterTableData () {
      return this.tableData.filter(row => {
        // 从初始需要表现字段中选择筛选
        const needFields = Object.assign({ id: 0 }, this.initialRow)
        return Object.keys(needFields).some(k => this.searchField === '' || row[k].toString().indexOf(this.searchField) > -1
        )
      })
    }
  },
  methods: {
    // api methods
    get, add, edit, del,
    fecthData () {
      this.isFetching = true
      this.get()
        .then(({ data }) => {
          this.tableData = data
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    // table methods
    handleAdd () {
      this.opt = 'add'
      this.row = Object.assign({}, this.initialRow)
      this.showDialog = true
    },
    handleEdit (index, row) {
      this.opt = 'edit'
      this.row = Object.assign({}, row)
      this.showDialog = true
    },
    handleDelete (index, row) {
      this.$confirm('确认删除？')
        .then(() => {
          this.isDeleting = true
          return this.del(row.id)
        })
        .then(() => {
          this.$message.success('删除成功')
          this.fecthData()
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    // pagination
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // dialog methods
    submitAdd (data) {
      this.isSubmiting = true
      this.add(data).then(() => {
        this.$message.success("添加成功")
        this.fecthData()
      }).finally(() => {
        this.showDialog = false
        this.isSubmiting = false
      })
    },
    submitEdit (data) {
      this.isSubmiting = true
      this.edit(data).then(res => {
        this.$message.success('更新成功')
        this.fecthData()
      }).finally(() => {
        this.showDialog = false
        this.isSubmiting = false
      })
    },
    cancelDialog () {
      this.showDialog = false
    }
  }
}
</script>