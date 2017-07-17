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
                       class-name='_text'>
        <template scope='scope'>
          {{scope.row.purchaseSupplier.company}}
        </template>
      </el-table-column>
  
      <el-table-column label="品牌"
                       sortable
                       prop='brand'
                       width="150">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       prop='brand'
                       :fn='edit'
                       type='text'>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="包装单位"
                       prop='packUnit'
                       sortable
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       prop='packUnit'
                       :fn='edit'
                       type='text'>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="包装价格(元)"
                       prop='packPrice'
                       sortable
                       width="130">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       prop='packPrice'
                       :fn='edit'
                       type='number'>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="辅材规格"
                       class-name='_text'>
        <template scope='scope'>
          {{scope.row.quotaAuxiliaryMaterial.name}}
        </template>
      </el-table-column>
      <el-table-column label="规格数量"
                       prop='specAmount'
                       sortable
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       prop='specAmount'
                       :fn='edit'
                       type='number'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="规格单价"
                       prop='specPrice'
                       sortable
                       class-name="_text"
                       width="100">
      </el-table-column>
  
      <el-table-column label="型号"
                       prop='model'
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       prop='model'
                       :fn='edit'
                       type='text'>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="启用"
                       class-name="_text"
                       width="60">
        <template scope='scope'>
          <inline-edit type='select'
                       :data='scope.row'
                       :fn='edit'
                       prop='isEnable'>
            <template slot='options'>
              <option :value="false">禁用</option>
              <option :value="true">启用</option>
            </template>
            <el-tag type='primary'
                    v-if='scope.row.isEnable'>
              启用
            </el-tag>
            <el-tag type='gray'
                    v-else>
              禁用
            </el-tag>
          </inline-edit>
  
        </template>
      </el-table-column>
  
      <el-table-column label="操作"
                       width='160'>
        <template scope="scope">
  
          <el-button size="mini"
                     :loading='isDeleting && scope.row.id=== delId'
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title='辅材'
               :visible.sync='showDialog'>
      <el-form :model='row'
               :rules="rules"
               label-width="80px">
        <el-form-item label='供应商'>
          <el-select v-model='row.purchaseSupplierId'>
            <el-option v-for='s in list.supplier'
                       :label='s.company'
                       :value='s.id'
                       :key='s.id'>
            </el-option>
          </el-select>
  
        </el-form-item>
  
        <el-form-item label='品牌'>
          <el-input placeholder='请输入包装品牌'
                    v-model='row.brand'></el-input>
        </el-form-item>
  
        <el-form-item label='包装单位'>
          <el-input placeholder='请输入包装单位(袋,包)'
                    v-model='row.packUnit'>
          </el-input>
        </el-form-item>
  
        <el-form-item label='包装价格'>
          <el-input-number placeholder='请输入包装价格'
                           :step='100'
                           v-model='row.packPrice'>
          </el-input-number>
          <span class="_ml2">元</span>
          <span class="_ml1">[步进100]</span>
        </el-form-item>
  
        <el-form-item label='辅材规格'>
          <el-select v-model='row.quotaAuxiliaryMaterialId'
                     filterable
                     remote
                     placeholder="输入规格名称查询"
                     :remote-method='auxRemoteMethod'>
            <el-option v-for='item in remoteOptions'
                       :key='item.id'
                       :value='item.id'
                       :label='item.name'>
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label='规格数量'
                      v-if="row.quotaAuxiliaryMaterialId">
          <el-input-number placeholder='请输入规格数量'
                           :min='0'
                           :step='10'
                           v-model='row.specAmount'>
          </el-input-number>
          <span class="_ml1">[步进10]</span>
        </el-form-item>
  
        <el-form-item label='规格单价'>
          <span class="_text">{{(row.packPrice / row.specAmount).toFixed(2)}}</span>
          <span class="_ml2">元</span>
          <span class="_ml1 _text">[ = 包装价格 / 规格数量 ]</span>
        </el-form-item>
  
        <el-form-item label='辅材型号'
                      prop="model">
          <el-input placeholder='请输入辅材型号(必填)'
                    v-model='row.model'>
          </el-input>
        </el-form-item>
  
        <el-form-item label='启用?'>
          <el-switch v-model="row.isEnable"
                     on-text="启用"
                     off-text="禁用">
          </el-switch>
  
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
import { get, add, edit, del, getAuxmaterial, getSupplier } from './api'

export default {
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
        model: '',

        isEnable: true
      },
      // edit && del

      delId: 0,
      isFetching: false,
      isDeleting: false,


      // map && list
      list: {
        auxmaterial: [],
        supplier: []
      },
      map: {
        auxmaterial: {},
        supplier: {}
      },

      remoteOptions: [],

      // dialog
      isSubmiting: false,
      showDialog: false,

      // pagination
      currentPage: 1,
      pageSize: 50,

      // search
      searchField: '',
      searchFields: ['id', 'quotaAuxiliaryMaterialId', 'purchaseSupplierId', 'packUnit', 'specAmount', 'packPrice', 'specPrice', 'brand'],

      rules: {
        model: [
          { required: true, message: '辅材型号不能为空' }
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
    // 搜索 id->name 映射表
    searchMap () {
      return {
        purchaseSupplierId: this.map.supplier,
        quotaAuxiliaryMaterialId: this.map.auxmaterial
      }
    }
  },
  methods: {
    edit,
    initData () {
      this.isFetching = true
      Promise.all([get(), getAuxmaterial(), getSupplier()])
        .then(([one, two, three]) => {
          this.tableData = one.data

          this.list = {
            auxmaterial: two.data,
            supplier: three.data
          }

          this.map = {
            auxmaterial: this.$utils.listToMap(two.data),
            supplier: this.$utils.listToMap(three.data, 'company'),
          }

        })
        .finally(() => {
          this.isFetching = false
        })
    },

    // table methods
    handleAdd () {
      this.row = this.$utils.deepCopy(this.initialRow)
      this.showDialog = true
      this.remoteOptions = this.list.auxmaterial
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
    // dialog methods
    submitAdd (addRow) {
      this.isSubmiting = true
      add(addRow).then(({ data }) => {
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
    auxRemoteMethod (query) {
      this.remoteOptions = this.list.auxmaterial.filter(item => item.name.indexOf(query) > -1)
    },
    cancelDialog () {
      this.showDialog = false
    }
  }
}
</script>