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
    <el-table v-loading='isFetching'
              :data="sliceTableData"
              border
              class="_mt2"
              :default-sort="{prop: 'id'}"
              style="width: 100%;">
  
      <el-table-column type='expand'>
        <template scope='scope'>
          <el-table v-if='scope.row.quotaArtficialCounters.length'
                    style="width=100%;"
                    border
                    :data='scope.row.quotaArtficialCounters'>
            <el-table-column label='id'
                             prop='id'
                             width='100'>
  
            </el-table-column>
            <el-table-column label='人工 计量'
                             prop='counter'
                             width='160'>
              <template scope='artScope'>
                <el-input v-model='artScope.row.counter'
                          size='mini'>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label='人工 工种'
                             prop='counter'>
              <template scope='artScope'>
                hello
              </template>
            </el-table-column>
            <el-table-column label='人工 价格'
                             prop='counter'>
            </el-table-column>
  
          </el-table>
          <el-table style="width=100%;"
                    v-if='scope.row.quotaAuxiliaryCounters.length'
                    border
                    :data='scope.row.quotaAuxiliaryCounters'>
            <el-table-column label='id'
                             prop='id'
                             width='100'>
            </el-table-column>
            <el-table-column label='辅材计量'
                             prop='counter'
                             width='100'>
            </el-table-column>
            <el-table-column label='辅材 名称'
                             prop='counter'>
            </el-table-column>
            <el-table-column label='辅材 单位'
                             prop='counter'>
            </el-table-column>
            <el-table-column label='辅材 价格'
                             prop='counter'>
            </el-table-column>
            <el-table-column label='辅材 品牌'
                             prop='counter'>
            </el-table-column>
  
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="＃"
                       sortable
                       prop='id'
                       width="60">
      </el-table-column>
      <el-table-column label="名称"
                       sortable
                       prop='name'
                       width="150">
      </el-table-column>
      <el-table-column label="类型"
                       sortable
                       prop='type'
                       width="100">
      </el-table-column>
      <el-table-column label="位置"
                       sortable
                       prop='position'
                       width="100">
      </el-table-column>
      <el-table-column label="阶段"
                       sortable
                       prop='stage'
                       width="100">
      </el-table-column>
      <el-table-column label="sec类型"
                       sortable
                       prop='sec_type'
                       width="100">
      </el-table-column>
      <el-table-column label="工种"
                       sortable
                       prop='work_type'
                       width="100">
      </el-table-column>
      <el-table-column label="单位"
                       prop='unit'
                       width="50">
      </el-table-column>
      <el-table-column label="损耗率"
                       sortable
                       prop='wastage'
                       width="80">
      </el-table-column>
      <el-table-column label="说明"
                       width='200'>
        <template scope='scope'>
          <el-popover trigger="hover"
                      placement='top'>
            {{scope.row.description}}
            <div slot='reference'>
              <div class="popover__reference"
                   v-text='scope.row.description'>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="工作内容"
                       width="220">
        <template scope='scope'>
          <el-popover trigger="hover"
                      placement='top'>
            <pre v-text='scope.row.content'></pre>
            <div slot='reference'>
              <div class="popover__reference"
                   v-text='scope.row.content'>
              </div>
            </div>
          </el-popover>
  
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width='160'>
        <template scope="scope">
          <el-button size='mini'
                     type='danger'
                     @click='handleDelete(scope.$index,scope.row)'>
            删除
          </el-button>
          <el-button size="mini"
                     type='success'
                     @click="addArticial(scope.$index, scope.row)">
            <i class="el-icon-plus"></i> 人工
          </el-button>
          <el-button size="mini"
                     type="success"
                     @click="addMaterial(scope.$index, scope.row)">
            <i class="el-icon-plus"></i> 辅材
          </el-button>
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
    <el-dialog title='添加定额'
               :visible.sync='showDialog'>
      <el-form :model='row'>
        <el-form-item label='名称'
                      :label-width="formLabelWidth">
          <el-input placeholder='请输入定额名称'
                    v-model='row.name'></el-input>
        </el-form-item>
        <el-form-item label='分类'
                      :label-width="formLabelWidth">
          <el-select v-model='row.type'
                     @change="row.sec_type=''">
            <el-option :key='tKey'
                       v-for='(secTypeList,tKey) in typeList'
                       :value='tKey'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if='row.type'
                      label='二级分类'
                      :label-width="formLabelWidth">
          <el-select v-model='row.sec_type'>
            <el-option :key='t'
                       v-for='t in typeList[row.type]'
                       :value='t'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='单位'
                      :label-width="formLabelWidth">
          <el-select v-model='row.unit'>
            <el-option :key='u'
                       v-for='u in unitList'
                       :value='u'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='位置'
                      :label-width="formLabelWidth">
          <el-select v-model='row.position'>
            <el-option :key='p'
                       v-for='p in positionList'
                       :value='p'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='阶段'
                      :label-width="formLabelWidth">
          <el-select v-model='row.stage'>
            <el-option :key='s'
                       v-for='s in stageList'
                       :value='s'>
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label='工种'
                      :label-width="formLabelWidth">
          <el-select v-model='row.work_type'>
            <el-option :key='w'
                       v-for='w in workTypeList'
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
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="success"
                   :loading='isAdding'
                   @click="submitAdd(row)">
          添 加
        </el-button>
      </div>
    </el-dialog>
  
  </div>
</template>

<script>
import axios from '@/plugins/axios'
import { get, add, edit, del, getArtList, getMatList, getMap } from './api'

export default {
  data () {
    return {
      // table
      tableData: [],
      row: {},
      initialRow: {
        name: '',
        type: '',
        stage: '',
        sec_type: '',
        unit: '',
        work_type: '',
        wastage: 0,
        position: '',
        quotaArtficialCounters: [],
        quotaAuxiliaryCounters: []
      },

      // table loading status
      isFetching: false,
      isDeleting: false,

      // map
      positionList: [],
      stageList: [],
      typeList: [],
      unitList: [],
      workTypeList: [],

      // dialog
      showDialog: false,
      isAdding: false,
      formLabelWidth: '80px',

      // pagination
      currentPage: 1,
      pageSize: 10,

      // search
      searchField: '',

      // artTable
      artList: [],
      artRow: {},
      initialArtRow: {
        quotaTemplateId: 0,
        quotaArtficialId: 0,
        counter: 0,
      },
      // matTable
      matList: [],
      matRow: {},
      initialMatRow: {
        quotaTemplateId: 0,
        quotaAuxiliaryMaterialId: 0,
        counter: 0,
      },
    }
  },
  created () {
    this.initData()
  },
  computed: {
    sliceTableData () {
      return this.filterTableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    // 从初始需要表现字段中选择筛选
    needFields () {
      return Object.keys(Object.assign({ id: 0 }, this.initialRow))
    },
    filterTableData () {
      return this.tableData.filter(row => {
        return this.needFields.some(k => {
          if (this.searchField === '') {
            return true
          }
          if (row[k] !== undefined && row[k] !== null) {
            return row[k].toString().indexOf(this.searchField) > -1
          }
        }
        )
      })
    }
  },
  methods: {
    // api methods
    get, add, edit, del, getArtList, getMatList, getMap,
    initData () {
      this.isFetching = true
      Promise.all([get(), getMap(), getArtList(), getMatList()])
        .then(([one, two, three, four]) => {
          // table
          this.tableData = one.data
          // map
          this.positionList = two.data.quota_template.position
          this.stageList = two.data.quota_template.stage
          this.typeList = two.data.quota_template.type
          this.unitList = two.data.quota_template.unit
          this.workTypeList = two.data.quota_template.work_type
          // art && mat
          this.artList = three.data
          this.matList = four.data
        })
        .finally(() => {
          this.isFetching = false
        })
    },
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
    handleSelectionChange (val) {
      this.multiSelection = val
    },
    handleAdd () {
      this.row = Object.assign({}, this.initialRow)
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
    addArticial (index, row) {
      row.quotaArtficialCounters.push({
        quotaTemplateId: row.id,

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
<style lang='scss'>

</style>
