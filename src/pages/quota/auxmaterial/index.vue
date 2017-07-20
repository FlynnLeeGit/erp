<template>
  <div>
    <el-breadcrumb class="_mb2">
      <el-breadcrumb-item>定额管理</el-breadcrumb-item>
      <el-breadcrumb-item>定额辅材规格</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click='handleAdd()'
               type='primary'>
      添加
    </el-button>
    <search class="_fr"
            v-model='searchField'
            :fields='searchFields'
            :table-data='list'
            :filter-table-data.sync='filterTableData'>
    </search>
    </el-input>
    <el-table v-loading='$isAjax.init'
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
      <el-table-column label="规格"
                       sortable
                       prop='name'
                       :sort-method="$utils.sortByChs.bind(this,'name')"
                       width="350">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       type='text'
                       prop='name'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="定额单位"
                       sortable
                       prop='specUnit'
                       :sort-method="$utils.sortByChs.bind(this,'specUnit')"
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       type='text'
                       prop='specUnit'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="类型"
                       sortable
                       prop='type'
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       type='select'
                       prop='type'>
            <template slot='options'>
              <option v-for='t in map.specType'
                      :key='t'
                      :value='t'
                      v-text='t'>
              </option>
            </template>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="描述"
                       sortable
                       prop='specDesc'
                       :sort-method="$utils.sortByChs.bind(this,'specDesc')"
                       width="120">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       type='text'
                       prop='specDesc'>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="采购限价"
                       sortable
                       prop='limitPrice'
                       width="120">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       type='number'
                       prop='limitPrice'>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="计算策略"
                       sortable
                       prop='calcStrategy'
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
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
                     :loading='$isAjax.delete && scope.row.id === currentDelId'
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">
            删除
          </el-button>
  
        </template>
      </el-table-column>
    </el-table>
  
    <!--pagination-->
    <el-pagination class="_mt2"
                   :page-sizes='[20,50,100,200]'
                   :total='filterTableData.length'
                   :current-page.sync="currentPage"
                   layout='total,sizes,prev,pager,next,jumper'
                   :page-size='pageSize'
                   @size-change='handleSizeChange'>
    </el-pagination>
  
    <!--dialog-->
    <el-dialog title='添加辅材规格'
               :visible.sync='showDialog'>
      <el-form :model='row'
               :rules='formRules'
               label-width='120px'>
        <el-form-item label='规格'
                      prop='name'>
          <el-input placeholder='请输入辅材名称'
                    v-model='row.name'></el-input>
        </el-form-item>
        <el-form-item label='定额单位'>
          <el-input placeholder='定额内使用单位(m,kg等)'
                    v-model='row.specUnit'></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="row.type"
                     placeholder="请选择类型">
            <el-option v-for="t in map.specType"
                       :key="t"
                       :value='t'
                       :label='t'>
  
            </el-option>
          </el-select>
  
        </el-form-item>
        <el-form-item label='描述'>
          <el-input placeholder='描述'
                    v-model='row.specDesc'></el-input>
        </el-form-item>
  
        <el-form-item label="采购限价">
          <el-input v-model="row.limitPrice"
                    placeholder="请输入采购限价 防止采购人员误输入不合理的价格">
          </el-input>
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
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="success"
                   :loading='$isAjax.create'
                   @click="submitAdd(row)">
          添 加
        </el-button>
      </div>
    </el-dialog>
  
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      // table
      filterTableData: [],
      row: {},
      initialRow: {
        name: '',
        specUnit: '',
        type: '',
        specDesc: '',
        calcStrategy: '1',
        limitPrice: ''
      },
      // edit && del

      // dialog
      showDialog: false,

      // pagination
      currentPage: 1,
      pageSize: 20,

      // search
      searchField: '',
      searchFields: ['id', 'name', 'specUnit', 'specDesc'],

      formRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ]
      }
    }
  },
  created () {
    this.init()
  },
  computed: {
    ...mapGetters('quota/auxmaterial', ['$isAjax', 'list', 'currentDelId']),
    ...mapGetters('quota', ['map']),
    sliceTableData () {
      return this.$utils.getPage(this.filterTableData, this.pageSize, this.currentPage)
    },
  },
  methods: {
    ...mapActions('quota/auxmaterial', ['init', 'create', 'update', 'delete']),
    // table methods
    calcStrategyFormatter (row) {
      return this.map.calcStrategy[row.calcStrategy]
    },
    handleAdd () {
      this.row = this.$utils.deepCopy(this.initialRow)
      this.showDialog = true
    },
    handleDelete (index, row) {
      this.$confirm('确认删除？')
        .then(() => {
          this.delete(row.id).then(() => {
            this.$message.success('删除成功')
          })
        })
    },
    // pagination
    handleSizeChange (val) {
      this.pageSize = val
    },
    closeDialog () {
      this.showDialog = false
    },
    submitAdd (data) {
      this.create(data).then(() => {
        this.$message.success("添加成功")
        this.closeDialog()
        this.$nextTick(() => {
          this.currentPage = Math.ceil(this.filterTableData.length / this.pageSize)
        })
      })
    }
  }
}
</script>