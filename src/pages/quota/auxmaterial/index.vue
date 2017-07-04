<template>
  <div>
    <el-button @click='handleAdd()'
               :loading='isSubmiting'
               type='primary'>
      添加
    </el-button>
    <search class="_fr"
            v-model='searchField'
            :fields='searchFields'
            :table-data='tableData'
            :filter-table-data.sync='filterTableData'>
    </search>
    </el-input>
    <el-table v-loading='isFetching'
              :data="sliceTableData"
              border
              class="_mt2"
              :default-sort="{prop: 'id'}"
              style="width: 100%">
      <el-table-column label="＃"
                       sortable
                       prop='id'
                       width="80">
      </el-table-column>
      <el-table-column label="名称"
                       sortable
                       prop='name'
                       :sort-method="$utils.sortByChs.bind(this,'name')"
                       width="180">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='edit'
                       type='text'
                       prop='name'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="单位"
                       sortable
                       prop='specUnit'
                       :sort-method="$utils.sortByChs.bind(this,'specUnit')"
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='edit'
                       type='text'
                       prop='specUnit'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="规格描述"
                       sortable
                       prop='specDesc'
                       :sort-method="$utils.sortByChs.bind(this,'specDesc')"
                       width="120">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='edit'
                       type='text'
                       prop='specDesc'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="计算策略"
                       sortable
                       prop='calcStrategy'
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='edit'
                       type='select'
                       prop='calcStrategy'>
            {{calcStrategyFormatter(scope.row)}}
            <template slot='options'>
              <option v-for='(c,cKey) in map.calcStrategy'
                      :key='cKey'
                      :value='cKey'
                      v-text='c'>
              </option>
            </template>
          </inline-edit>
        </template>
  
      </el-table-column>
      <el-table-column label="操作"
                       width='160'>
        <template scope="scope">
          <el-button size="mini"
                     :loading='isDeleting && scope.row.id === delId'
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">
            删除
          </el-button>
  
        </template>
      </el-table-column>
    </el-table>
  
    <!--pagination-->
    <el-pagination class="_mt2"
                   :page-sizes='[50,100,200]'
                   :total='filterTableData.length'
                   :current-page.sync="currentPage"
                   layout='total,sizes,prev,pager,next,jumper'
                   :page-size='pageSize'
                   @size-change='handleSizeChange'>
    </el-pagination>
  
    <!--dialog-->
    <el-dialog title='添加辅材'
               :visible.sync='showDialog'>
      <el-form :model='row'
               :rules='formRules'
               label-width='80px'>
        <el-form-item label='名称'
                      prop='name'>
          <el-input placeholder='请输入辅材名称'
                    v-model='row.name'></el-input>
        </el-form-item>
        <el-form-item label='单位'>
          <el-input placeholder='请输入辅材单位(个,m,桶等)'
                    v-model='row.specUnit'></el-input>
        </el-form-item>
        <el-form-item label='规格描述'>
          <el-input placeholder='描述'
                    v-model='row.specDesc'></el-input>
        </el-form-item>
        <el-form-item label='计算策略'
                      prop='calcStrategy'>
          <el-select v-model='row.calcStrategy'>
            <el-option v-for='(c,cKey) in map.calcStrategy'
                       :key='cKey'
                       :label='c'
                       :value='cKey'>
            </el-option>
          </el-select>
        </el-form-item>
  
      </el-form>
      <div slot='footer'
           class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
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
import { get, getMap, add, edit, del } from './api'

export default {
  data () {
    return {
      // table
      tableData: [],
      filterTableData: [],
      row: {},
      initialRow: {
        name: '',
        specUnit: '',
        specDesc: '',
        calcStrategy: '1'
      },
      // edit && del

      delId: 0,
      isFetching: false,
      isDeleting: false,

      map: {},
      // dialog
      isSubmiting: false,
      showDialog: false,

      // pagination
      currentPage: 1,
      pageSize: 50,

      // search
      searchField: '',
      searchFields: ['id', 'name', 'specUnit', 'specDesc'],

      formRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        calcStrategy: [
          { required: true }
        ]
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
  },
  methods: {
    edit,
    initData () {
      this.isFetching = true
      Promise.all([get(), getMap()])
        .then(([one, two]) => {
          this.tableData = one.data
          this.map = two.data.quota_template
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    // table methods
    calcStrategyFormatter (row) {
      return this.map.calcStrategy[row.calcStrategy]
    },
    handleAdd () {
      this.row = this.$utils.deepCopy(this.initialRow)
      this.showDialog = true
    },

    handleDelete (index, row) {
      this.delId = row.id
      this.$confirm('确认删除？')
        .then(() => {
          this.isDeleting = true
          return del(row.id)
        })
        .then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(this.delIdx, 1)
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    // pagination
    handleSizeChange (val) {
      this.pageSize = val
    },

    submitAdd (data) {
      this.isSubmiting = true
      add(data).then(({ data }) => {
        this.$message.success("添加成功")
        this.showDialog = false
        this.tableData.push(data)
        this.$nextTick(() => {
          this.currentPage = Math.ceil(this.filterTableData.length / this.pageSize)
        })
      }).finally(() => {
        this.isSubmiting = false
      })
    },
  }
}
</script>