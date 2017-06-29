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
            :map="searchMap"
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
                       class-name='_text'
                       prop='purchaseSupplierId'
                       :formatter='supplierFormatter'>
      </el-table-column>
  
      <el-table-column label="品牌"
                       sortable
                       prop='brand'
                       width="150">
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
                       class-name='_text'
                       prop='quotaAuxiliaryMaterialId'
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
  
      <el-table-column label="启用"
                       sortable
                       class-name="_text"
                       width="60">
        <template scope='scope'>
  
          <el-tag type='primary'
                  v-if='scope.row.isEnable'>
            启用
          </el-tag>
          <el-tag type='gray'
                  v-else>
            禁用
          </el-tag>
  
        </template>
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
          <el-select :disabled='isEdit'
                     v-model='row.purchaseSupplierId'>
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
          <el-select :disabled='isEdit'
                     v-model='row.quotaAuxiliaryMaterialId'>
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
  
        <el-form-item label='启用?'
                      :label-width="formLabelWidth">
          <el-switch v-model="row.isEnable"
                     on-text="启用"
                     off-text="禁用">
          </el-switch>
  
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
import { getPage, listToMap, deepCopy } from '@/plugins/utils'
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
        purchaseSupplierId: '',
        packUnit: '',
        packPrice: 0,

        quotaAuxiliaryMaterialId: '',
        specAmount: 10,
        specPrice: 0,
        brand: '',

        isEnable: true
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
      searchFields: ['id', 'quotaAuxiliaryMaterialId', 'purchaseSupplierId', 'packUnit', 'specAmount', 'packPrice', 'specPrice', 'brand']
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
    },
    searchMap () {
      return {
        purchaseSupplierId: this.supplierMap,
        quotaAuxiliaryMaterialId: this.auxmaterialMap
      }
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
      return this.supplierMap[row.purchaseSupplierId]
    },
    specFormatter (row) {
      return this.auxmaterialMap[row.quotaAuxiliaryMaterialId]
    },
    // table methods
    handleAdd () {
      this.opt = 'add'
      this.row = deepCopy(this.initialRow)
      this.showDialog = true
    },
    handleEdit (index, row) {
      this.opt = 'edit'
      this.editIdx = this.tableData.indexOf(row)
      this.row = deepCopy(row)
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
    submitAdd (addRow) {
      this.isSubmiting = true
      add(addRow).then(({ data }) => {
        this.$message.success("添加成功")
        this.showDialog = false
        this.tableData.push(data)
      }).finally(() => {
        this.isSubmiting = false
      })
    },
    submitEdit (editRow) {
      this.isSubmiting = true
      edit(editRow).then(({ data }) => {
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