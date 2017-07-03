<template>
  <div>
    <el-button @click='handleAdd()'
               type='primary'>
      添加用户
    </el-button>
    <search class="_fr"
            v-model='searchField'
            :fields='searchFields'
            :map='searchMap'
            :table-data='tableData'
            :filter-table-data.sync='filterTableData'>
    </search>
    </el-input>
    <el-table v-loading='isFetching'
              :data="sliceTableData"
              border
              class="_mt2"
              highlight-current-row
              :default-sort="{prop: 'id'}"
              style="width: 100%">
      <el-table-column label="＃"
                       sortable
                       prop='id'
                       width="80">
      </el-table-column>
      <el-table-column label="部门"
                       class-name="_text"
                       prop='departmentId'
                       sortable
                       width="100">
        <template scope='scope'>
          {{map.department[scope.row.departmentId].name}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱"
                       class-name="_text"
                       prop='email'
                       sortable>
      </el-table-column>
      <el-table-column label="姓名"
                       class-name="_text"
                       sortable
                       prop='name'
                       width="180">
      </el-table-column>
      <el-table-column label="手机"
                       class-name="_text"
                       prop='mobile'
                       sortable
                       width="100">
      </el-table-column>
  
      <el-table-column label="性别"
                       class-name="_text"
                       width="100">
        <template scope='scope'>
          {{map.gender[scope.row.gender]}}
        </template>
      </el-table-column>
      <el-table-column label="账户状态"
                       width="100">
        <template scope='scope'>
          <el-tag v-if='scope.row.isActive'
                  type='primary'>正常</el-tag>
          <el-tag v-else>禁用</el-tag>
        </template>
      </el-table-column>
  
      <el-table-column label="操作"
                       width='160'>
        <template scope="scope">
  
          <el-button size="mini"
                     :loading='isDeleting && scope.row.id === delId'
                     type="warning"
                     @click="handleDelete(scope.$index, scope.row)">
            禁用</el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!--pagination-->
    <el-pagination class="_mt2"
                   :page-sizes='[50,100,200]'
                   :total='tableData.length'
                   :current-page.sync="currentPage"
                   layout='total,sizes,prev,pager,next,jumper'
                   :page-size='pageSize'
                   @size-change='handleSizeChange'>
    </el-pagination>
  
    <!--dialog-->
    <el-dialog title='添加用户'
               :visible.sync='showDialog'>
      <el-form :model='row'
               :rules='formRules'
               label-width='80px'>
        <el-form-item label='邮箱'
                      prop='email'>
          <el-input placeholder='请输入邮箱'
                    v-model='row.email'
                    autofocus>
          </el-input>
        </el-form-item>
        <el-form-item label='姓名'
                      prop='name'>
          <el-input placeholder='请输入姓名'
                    v-model='row.name'>
          </el-input>
        </el-form-item>
        <el-form-item label='手机号'
                      prop='mobile'>
          <el-input placeholder='请输入手机号'
                    v-model='row.mobile'>
          </el-input>
        </el-form-item>
        <el-form-item label='部门'
                      prop='departmentId'>
          <el-select placeholder='请输入部门'
                     v-model='row.departmentId'>
            <el-option v-for='(d,dKey) in map.department'
                       :key='dKey'
                       :label='d.name'
                       :value='dKey'>
            </el-option>
  
          </el-select>
        </el-form-item>
        <el-form-item label='性别'
                      prop='gender'>
          <el-select placeholder='请输入性别'
                     v-model='row.gender'>
            <el-option v-for='(g,gKey) in map.gender'
                       :key='gKey'
                       :label='g'
                       :value='gKey'>
            </el-option>
  
          </el-select>
        </el-form-item>
  
      </el-form>
      <div slot='footer'
           class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="success"
                   :loading='isSubmiting'
                   @click="submitAdd(row)">
          添 加
        </el-button>
      </div>
    </el-dialog>
  
  </div>
</template>

<script>
import { get, add, del, getMap } from './api'

export default {
  data () {
    return {
      // table
      tableData: [],
      filterTableData: [],
      row: {},
      initialRow: {
        name: '',
        email: '',
        mobile: '',
        departmentId: '',
        gender: ''
      },
      // edit && del
      delId: 0,
      isFetching: false,
      isDeleting: false,

      map: {
        department: {},
        gender: {}
      },
      // dialog
      isSubmiting: false,
      showDialog: false,

      // pagination
      currentPage: 1,
      pageSize: 50,

      // search
      searchField: '',
      searchFields: ['id', 'name', 'email', 'mobile', 'departmentId', 'gender'],

      formRules: {
        // workType: [
        //   { required: true, message: '请输入工种名称', trigger: 'blur' },
        // ]
      }
    }
  },
  created () {
    this.initData()
  },
  computed: {
    sliceTableData () {
      return this.$utils.getPage(this.filterTableData, this.pageSize, this.currentPage)
    },
    searchMap () {
      const dMap = {}

      Object.keys(this.map.department).forEach(k => {
        dMap[k] = this.map.department[k].name
      })

      return {
        departmentId: dMap,
        gender: this.map.gender
      }
    }
  },
  methods: {
    initData () {
      this.isFetching = true
      Promise.all([get(), getMap()])
        .then(([one, two]) => {
          this.tableData = one.data
          this.map = two.data

        })
        .finally(() => {
          this.isFetching = false
        })
    },
    // table methods
    handleAdd () {
      this.row = this.$utils.deepCopy(this.initialRow)
      this.showDialog = true
    },
    handleDelete (index, row) {
      this.delId = row.id
      this.$confirm('确认禁用？')
        .then(() => {
          this.isDeleting = true
          return del(row.id)
        })
        .then(({ data }) => {
          this.$message.success('禁用成功')
          this.$utils.replaceObjectFields(row, data)
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    // pagination
    handleSizeChange (val) {
      this.pageSize = val
    },
    // dialog methods
    submitAdd (data) {
      this.isSubmiting = true
      add(data).then(({ data }) => {
        this.$message.success("添加用户成功")
        this.showDialog = false
        this.tableData.push(data)
        this.$nextTick(() => {
          this.currentPage = Math.ceil(this.filterTableData.length / this.pageSize)
        })
      }).finally(() => {
        this.isSubmiting = false
      })
    },
    cancelDialog () {
      this.showDialog = false
    }
  }
}
</script>