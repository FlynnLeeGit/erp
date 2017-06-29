<template>
  <div>
    <el-button @click='handleAdd()'
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
                       width="180">
      </el-table-column>
      <el-table-column label="单位"
                       prop='specUnit'
                       sortable
                       width="100">
      </el-table-column>
      <el-table-column label="规格描述"
                       prop='specDesc'
                       sortable
                       width="120">
      </el-table-column>
      <el-table-column label="计算策略"
                       sortable
                       :formatter='calcStrategyFormatter'
                       prop='calcStrategy'
                       width="100">
      </el-table-column>
      <!--<el-table-column label='使用此规格材料'>
        <template scope='scope'>
          <div v-if='scope.row.purchaseMaterials.length'>
            <el-tag v-for='m in scope.row.purchaseMaterials'
                    :key='m.id'
                    type='primary'>
              {{m.brand}}-{{m.packPrice}}元/{{m.packUnit}}-数量{{m.specAmount}}
            </el-tag>
          </div>
          <span v-else>
            <el-tag type='gray'>无</el-tag>
          </span>
        </template>
  
      </el-table-column>-->
      <el-table-column label="操作"
                       width='160'>
        <template scope="scope">
          <el-button size="mini"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
   
            <el-button size="mini"
                       :loading='isDeleting && scope.$index === delIdx'
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
                   :total='tableData.length'
                   :current-page="currentPage"
                   layout='total,sizes,prev,pager,next,jumper'
                   :page-size='pageSize'
                   @current-change='handleCurrentChange'
                   @size-change='handleSizeChange'>
    </el-pagination>
  
    <!--dialog-->
    <el-dialog title='辅材'
               :visible.sync='showDialog'>
      <el-form :model='row'
               :rules='formRules'>
        <el-form-item v-if="opt==='edit'"
                      label='id'
                      :label-width="formLabelWidth">
          {{row.id}}
        </el-form-item>
        <el-form-item label='名称'
                      prop='name'
                      :label-width="formLabelWidth">
          <el-input placeholder='请输入辅材名称'
                    v-model='row.name'></el-input>
        </el-form-item>
        <el-form-item label='单位'
                      :label-width="formLabelWidth">
          <el-input placeholder='请输入辅材单位(个,m,桶等)'
                    v-model='row.specUnit'></el-input>
        </el-form-item>
        <el-form-item label='规格描述'
                      :label-width="formLabelWidth">
          <el-input placeholder='描述'
                    v-model='row.specDesc'></el-input>
        </el-form-item>
        <el-form-item label='计算策略'
                      prop='calcStrategy'
                      :label-width="formLabelWidth">
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
import { get, getMap, add, edit, del } from './api'
import { getPage } from '@/plugins/utils'
import Search from '@/components/Search.vue'
export default {
  components: {
    Search
  },
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
        calcStrategy: ''
      },
      // edit && del
      editIdx: 0,
      delIdx: 0,
      isFetching: false,
      isDeleting: false,

      map: {},
      // dialog
      isSubmiting: false,
      showDialog: false,
      formLabelWidth: '80px',
      opt: 'add',

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
      return getPage(this.filterTableData, this.pageSize, this.currentPage)
    },
  },
  methods: {
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
      this.opt = 'add'
      this.row = Object.assign({}, this.initialRow)
      this.showDialog = true
    },
    handleEdit (index, row) {
      this.opt = 'edit'
      this.editIdx = this.tableData.indexOf(row)
      this.row = Object.assign({}, row)
      this.showDialog = true
    },
    handleDelete (index, row) {
      this.delIdx = this.tableData.indexOf(row)
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
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // dialog methods
    submitAdd (data) {
      this.isSubmiting = true
      add(data).then(({ data }) => {
        this.$message.success("添加成功")
        this.showDialog = false
        this.tableData.push(data)
      }).finally(() => {
        this.isSubmiting = false
      })
    },
    submitEdit (data) {
      this.isSubmiting = true
      edit(data).then(({ data }) => {
        this.$message.success('更新成功')
        this.showDialog = false
        this.tableData.splice(this.editIdx, 1, data)
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