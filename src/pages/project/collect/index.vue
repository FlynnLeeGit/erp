<template>
  <div>
    <el-row>
      <search class="_fr"
              v-model='searchField'
              :fields='searchFields'
              :table-data='tableData'
              :filter-table-data.sync='filterTableData'>
      </search>
    </el-row>
    <el-table class="_mt2"
              border
              :row-class-name='rowCls'
              v-loading='isFetching'
              style="width:100%"
              :data='mergeTable'>
      <el-table-column label='tag'
                       align='center'
                       width='60'>
        <template scope='scope'>
          <el-tag type='info'>
            标签
          </el-tag>
        </template>
      </el-table-column>
  
      <el-table-column label='#'
                       prop='id'
                       width='50'>
      </el-table-column>
  
      <el-table-column label="名称"
                       show-overflow-tooltip
                       prop='name'
                       width='120'>
      </el-table-column>
  
      <el-table-column label="品牌"
                       show-overflow-tooltip
                       prop='brand'
                       width='50'>
  
      </el-table-column>
  
      <el-table-column label="大类"
                       prop='type'
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="小类"
                       prop='secType'
                       show-overflow-tooltip>
  
      </el-table-column>
      <el-table-column label="单位"
                       prop='unit'
                       width='50'>
      </el-table-column>
      <el-table-column label="位置"
                       show-overflow-tooltip
                       prop='position'
                       width='50'>
      </el-table-column>
      <el-table-column label="阶段"
                       prop='stage'
                       show-overflow-tooltip
                       width="60">
      </el-table-column>
      <el-table-column label="损耗率"
                       prop='wastage'
                       width="80">
  
      </el-table-column>
      <el-table-column label='人工价'
                       width='80'
                       prop='artificialUnitPrice'>
  
      </el-table-column>
      <el-table-column label='辅材价'
                       width='80'
                       prop='auxiliaryMaterialUnitPrice'>
  
      </el-table-column>
      <el-table-column label='主材价'
                       width='80'
                       prop='principalMaterialUnitPrice'>
      </el-table-column>
      <el-table-column label='合计价'
                       width='80'
                       prop='totalUnitPrice'>
      </el-table-column>
  
      <el-table-column label='说明'
                       show-overflow-tooltip
                       class-name="_text"
                       prop='description'>
      </el-table-column>
      <el-table-column label='工作内容'
                       show-overflow-tooltip
                       prop='content'
                       class-name="_text">
      </el-table-column>
      <el-table-column label='操作'>
        <template scope='scope'>
          <el-button size='mini'
                     @click='handleAdd'
                     type='success'>添加常用</el-button>
        </template>
      </el-table-column>
  
    </el-table>
  
    <!--dialog-->
    <el-dialog title='列为常用'
               :visible.sync='showDialog'>
      <el-form :model='row'
               label-width='80px'>
        <el-form-item label='标签'>
          <el-input placeholder='请输入给予此定额的标签'
                    v-model='row.name'></el-input>
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
import { get, edit, del, add, getQuota } from './api'

export default {
  data () {
    return {
      tableData: [],
      collectData: [],
      filterTableData: [],
      isFetching: false,

      searchField: '',
      searchFields: ['id', 'name', 'type', 'stage', 'secType', 'unit', 'workType', 'wastage', 'position', 'content', 'description'],


      row: {},
      initialRow: {
        name: ''
      },

      showDialog: false,
      isSubmiting: false
    }
  },
  computed: {
    mergeTable () {
      return this.filterTableData
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.isFetching = true
      Promise.all([getQuota(), get()])
        .then(([one, two]) => {
          this.tableData = one.data
          this.collectData = two.data
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    handleAdd () {
      this.row = this.$utils.deepCopy(this.initialRow)
      this.showDialog = true
    },
    submitAdd (row) {
      this.isSubmiting = true
      add(row).then(({ data }) => {
        this.$message.success('添加常用定额成功！')
        this.showDialog = false
        this.collectData.push(data)
      }).finally(() => {

        this.isSubmiting = false
      })
    },
    cancelDialog () {
      this.showDialog = false
    },
    rowCls (row) {
      // if (row.diff.status === 'delete') {
      //   return 'danger-row'
      // }
      // if (row.diff.status === 'add') {
      //   return 'success-row'
      // }
    }
  }
}
</script>


