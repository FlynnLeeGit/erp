<template>
  <div>
    <el-alert title='将常用的定额打上标签，方便您日后预算制作时的选取'></el-alert>
    <el-row class="_mt1">
      <search v-model='searchField'
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
              :data='sliceTableData'>
      <el-table-column label='标签'
                       align='center'
                       width='80'>
        <template scope='scope'>
          <el-tag type='primary'
                  v-if='scope.row.tag'>
            {{scope.row.tag}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label='操作'
                       align="center"
                       width='80'>
        <template scope='scope'>
          <el-button v-if='!scope.row.tag'
                     size='mini'
                     @click='handleAdd(scope.row)'
                     type='success'>
            <i class="fa fa-plus"></i>
            列为常用
          </el-button>
          <el-button v-else
                     :loading='isDeleting && delId === scope.row.id'
                     size='mini'
                     @click='handleDelete(scope.row)'
                     type='danger'>
            <i class="fa fa-close"></i>取消
          </el-button>
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
  
    </el-table>
    <!--pagination-->
    <el-pagination class="_mt2"
                   :page-sizes='[50,100,200,500]'
                   :total='filterTableData.length'
                   :current-page.sync="currentPage"
                   layout='total,sizes,prev,pager,next,jumper'
                   :page-size='pageSize'
                   @size-change='handleSizeChange'>
    </el-pagination>
    <!--dialog-->
    <el-dialog title='列为常用'
               :visible.sync='showDialog'>
      <el-form :model='row'
               ref='dialogForm'
               :rules='formRules'
               label-width='80px'>
        <el-form-item label='标签'
                      prop='name'>
          <el-select v-model='row.name'
                     allow-create
                     filterable
                     placeholder="为此定额添加标签">
            <el-option v-for='tag in tags'
                       :key='tag'
                       :value='tag'>
            </el-option>
          </el-select>
          <span class="_ml1">(可从之前的标签中选择或手工输入)</span>
        </el-form-item>
      </el-form>
      <div slot='footer'
           class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="success"
                   :loading='isSubmiting'
                   @click="submitAdd(row)">
          确 定
        </el-button>
  
      </div>
    </el-dialog>
  
  </div>
</template>
<script>
import { get, edit, del, add, getQuota, getTags } from './api'

export default {
  data () {
    return {
      tableData: [],
      collectData: [],
      filterTableData: [],
      tags: [],
      isFetching: false,
      row: {},

      searchField: '',
      searchFields: ['tag', 'id', 'name', 'type', 'stage', 'secType', 'unit', 'workType', 'wastage', 'position', 'content', 'description'],

      currentPage: 1,
      pageSize: 50,

      editQRow: {},
      delId: 0,
      isDeleting: false,
      showDialog: false,
      isSubmiting: false,
      formRules: {
        name: [
          { required: true, message: '标签名称不能为空' }
        ]
      }
    }
  },
  computed: {
    sliceTableData () {
      return this.$utils.getPage(this.filterTableData, this.pageSize, this.currentPage)
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
          this.tableData = this.mergeTable(one.data, two.data)
          this.collectData = two.data
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    // 更新tableData tag字段
    mergeTable (quotaTable, collectTable) {
      const collectMap = {}
      // 以定额id为key的map
      collectTable.forEach(cItem => {
        collectMap[cItem.quotaTemplateId] = cItem
      })
      quotaTable.forEach(qItem => {
        qItem.tag = ''
        qItem.tagId = 0
        if (collectMap[qItem.id]) {
          qItem.tag = collectMap[qItem.id].name
          qItem.tagId = collectMap[qItem.id].id
        }
      })
      return quotaTable
    },
    handleAdd (qRow) {
      getTags().then(({ data }) => {
        this.tags = data
        this.editQRow = qRow
        this.row = {
          name: '',
          quotaTemplateId: qRow.id
        }
        this.showDialog = true
      })
    },
    handleDelete (qRow) {
      this.$confirm('确认取消？')
        .then(() => {
          this.isDeleting = true
          this.delId = qRow.id
          return del(qRow.tagId)
        })
        .then(() => {
          this.$message.success('取消常用成功！')
          qRow.tag = ''
          qRow.tagId = 0
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    submitAdd (row) {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.isSubmiting = true
          add(row).then(({ data }) => {
            this.$message.success('添加常用定额标注成功！')
            this.showDialog = false
            this.editQRow.tag = data.name
            this.editQRow.tagId = data.id
          }).finally(() => {
            this.isSubmiting = false
          })
        } else {
          return false
        }
      })


    },
    cancelDialog () {
      this.showDialog = false
    },
    rowCls (row) {
      if (row.tag) {
        return 'primary-row'
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
    }
  }
}
</script>


