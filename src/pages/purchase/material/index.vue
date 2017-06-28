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
            :map="{
                supplierId:supplierMap,
                specId:auxmaterialMap
              }"
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
  
      <el-table-column label="供应商"
                       sortable
                       prop='supplierId'
                       :formatter='supplierFormatter'>
      </el-table-column>
  
      <el-table-column label="品牌"
                       sortable
                       width="150">
        <template scope='scope'>
          <el-tag type='primary'>{{scope.row.brand}}</el-tag>
        </template>
      </el-table-column>
  
      <el-table-column label="包装单位"
                       prop='packUnit'
                       sortable
                       width="100">
      </el-table-column>
  
      <el-table-column label="包装价格(元)"
                       prop='packPrice'
                       sortable
                       width="130">
      </el-table-column>
  
      <el-table-column label="辅材规格"
                       prop='specId'
                       :formatter="specFormatter"
                       sortable>
      </el-table-column>
      <el-table-column label="规格数量"
                       prop='specAmount'
                       sortable
                       width="100">
      </el-table-column>
      <el-table-column label="规格单价"
                       prop='specPrice'
                       sortable
                       class-name="_text"
                       width="100">
      </el-table-column>
  
      <el-table-column label="操作"
                       width='160'>
        <template scope="scope">
          <el-button size="mini"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini"
                     :loading='isDeleting && scope.$index === delIdx'
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
      <el-form :model='row'>
        <el-form-item v-if="isEdit"
                      label='id'
                      :label-width="formLabelWidth">
          {{row.id}}
        </el-form-item>
        <el-form-item label='供应商'
                      :label-width="formLabelWidth">
          <el-select v-model='row.supplierId'>
            <el-option v-for='s in supplierList'
                       :label='s.company'
                       :value='s.id'
                       :key='s.id'>
            </el-option>
          </el-select>
  
        </el-form-item>
  
        <el-form-item label='包装品牌'
                      :label-width="formLabelWidth">
          <el-input placeholder='请输入包装品牌'
                    v-model='row.brand'></el-input>
        </el-form-item>
  
        <el-form-item label='包装单位'
                      :label-width="formLabelWidth">
          <el-input placeholder='请输入包装单位(袋,包)'
                    v-model='row.packUnit'>
          </el-input>
        </el-form-item>
  
        <el-form-item label='包装价格'
                      :label-width="formLabelWidth">
          <el-input-number placeholder='请输入包装价格'
                           :step='100'
                           v-model='row.packPrice'>
          </el-input-number>
          <span class="_ml2">元</span>
        </el-form-item>
  
        <el-form-item label='辅材规格'
                      :label-width="formLabelWidth">
          <el-select v-model='row.specId'>
            <el-option v-for='a in auxmaterialList'
                       :label='a.name'
                       :value='a.id'
                       :key='a.id'>
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label='规格数量'
                      :label-width="formLabelWidth">
          <el-input-number placeholder='请输入规格数量'
                           :step='10'
                           v-model='row.specAmount'>
          </el-input-number>
        </el-form-item>
  
        <el-form-item label='规格单价'
                      :label-width="formLabelWidth">
          <span class="_text">{{(row.packPrice / row.specAmount).toFixed(2)}}</span>
          <span class="_ml2">元</span>
        </el-form-item>
  
      </el-form>
      <div slot='footer'
           class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button v-if="isAdd"
                   type="success"
                   :loading='isSubmiting'
                   @click="submitAdd(row)">
          添 加
        </el-button>
        <el-button v-if="isEdit"
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
import { get, add, edit, del, getAuxmaterial, getSupply } from './api'
import { getPage, listToMap } from '@/plugins/utils'
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
        supplierId: '',
        packUnit: '',
        packPrice: 0,

        specId: '',
        specAmount: 10,
        specPrice: 0,
        brand: ''
      },
      // edit && del
      editIdx: 0,
      delIdx: 0,
      isFetching: false,
      isDeleting: false,

      map: {},

      auxmaterialList: [],
      auxmaterialMap: {},
      supplierList: [],
      supplierMap: {},
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
      searchFields: ['id', 'specId', 'supplierId', 'packUnit', 'specAmount', 'packPrice', 'specPrice', 'brand']
    }
  },
  created () {
    this.initData()
  },
  computed: {
    sliceTableData () {
      return getPage(this.filterTableData, this.pageSize, this.currentPage)
    },
    isAdd () {
      return this.opt === 'add'
    },
    isEdit () {
      return this.opt === 'edit'
    }
  },
  methods: {
    initData () {
      this.isFetching = true
      Promise.all([get(), getAuxmaterial(), getSupply()])
        .then(([one, two, three]) => {
          this.tableData = one.data
          this.auxmaterialList = two.data
          this.auxmaterialMap = listToMap(this.auxmaterialList)
          this.supplierList = three.data
          this.supplierMap = listToMap(this.supplierList, 'company')
        })
        .finally(() => {
          this.isFetching = false
        })
    },

    // formatter
    supplierFormatter (row) {
      return this.supplierMap[row.supplierId]
    },
    specFormatter (row) {
      return this.auxmaterialMap[row.specId]
    },
    // table methods
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