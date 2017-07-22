<template>
  <div>
    <el-row class="_mt1">
      <search v-model='searchField'
              :fields='searchFields'
              :table-data='tableData'
              :filter-table-data.sync='filterTableData'>
      </search>
    </el-row>
    <el-tabs v-model='selectedTag'
             @tab-click='handleChangeTag'>
      <el-tab-pane label='全部'
                   name='all'>
      </el-tab-pane>
      <el-tab-pane v-for='(tagId,tagName) in tags'
                   :key='tagName'
                   :label='tagName'
                   :name='tagName'>
      </el-tab-pane>
    </el-tabs>
    <el-table border
              :row-class-name='rowCls'
              v-loading='isFetching'
              style="width:100%"
              @selection-change="handleSelectionChange"
              :data='sliceTableData'>
      <el-table-column type='selection'
                       v-if='pickerMode'
                       align="center"
                       width="40">
      </el-table-column>
      <el-table-column label='标签'
                       align='center'
                       prop="tag"
                       sortable
                       width='80'>
        <template scope='scope'>
          <el-tag type='primary'
                  v-if='scope.row.tagId'>
            {{scope.row.tag}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label='操作'
                       v-if="editerMode"
                       align="center"
                       width='80'>
        <template scope='scope'>
          <el-button v-if='!scope.row.tagId'
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
            <i class="fa fa-close"></i>取消常用
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label='#'
                       prop='id'
                       sortable
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
                   :page-sizes='[20,50,100,200,500]'
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
            <el-option v-for='(tagId,tagName) in tags'
                       :key='tagId'
                       :value='tagName'>
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
import { get, update, del, create, getQuota, getByVersion } from './api'
export default {
  props: {
    pickerMode: {
      type: Boolean,
      default: false
    },
    editerMode: {
      type: Boolean,
      default: false
    },
    version: {
      type: String,
      default: ''
    },
    disabledRows: {
      type: Array,
      default: () => []
    },
    selection: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      getQuotasFunction: () => { },

      quotas: [],
      quotaCollects: [],
      filterTableData: [],
      isFetching: false,
      row: {},
      onlyShowCollect: false,

      selectedTag: 'all',
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
    },
    // 用于标签去重选择
    tags () {
      // 名称为key，id为value的map 正好去重
      return this.$utils.listToMap(this.quotaCollects, 'id', 'name')
    },
    tableData () {
      let _map = {}
      this.quotaCollects.forEach(c => {
        _map[c.quotaTemplateId] = c
      })
      return this.quotas
        .map(q => {
          q.tagId = 0
          q.tag = ''
          if (_map[q.id]) {
            q.tagId = _map[q.id].id
            q.tag = _map[q.id].name
          }
          return q
        })
        // 排除禁用的行
        .filter(q => this.disabledRows.indexOf(q.id) === -1)
        .filter(q => this.selectedTag === q.tag || this.selectedTag === 'all')
    }
  },
  created () {
    if (this.pickerMode) {
      this.initPickerMode()
    }
    if (this.editerMode) {
      this.initEditerMode()
    }
    this.initData()
  },
  methods: {
    initPickerMode () {
      this.onlyShowCollect = this.pickerMode
      this.pageSize = 20
      this.getQuotasFunction = () => getByVersion(this.version)
    },
    initEditerMode () {
      this.getQuotasFunction = () => getQuota()
    },
    initData () {
      this.isFetching = true
      Promise.all([this.getQuotasFunction(), get()])
        .then(([one, two]) => {
          this.quotas = one.data
          this.quotaCollects = two.data
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    handleSelectionChange (selectedQuotas) {
      this.$emit('update:selection', selectedQuotas.map(q => q.id))
    },
    // 更新tableData tag字段
    handleAdd (qRow) {
      this.showDialog = true
      this.row = {
        name: '',
        quotaTemplateId: qRow.id
      }
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
          const delCollectIndex = this.quotaCollects.indexOf(this.quotaCollects.filter(c => c.id === qRow.tagId)[0])
          this.quotaCollects.splice(delCollectIndex, 1)
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    submitAdd (row) {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.isSubmiting = true
          create(row).then(({ data }) => {
            this.$message.success('添加常用定额标注成功！')
            this.showDialog = false
            this.quotaCollects.push(data)
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
      if (this.editerMode && row.tagId) {
        return 'primary-row'
      }
      if (this.pickerMode && this.selection.indexOf(row.id) > -1) {
        return 'success-row'
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleChangeTag (tag) {
      console.log(tag.name)
    }
  }
}
</script>


