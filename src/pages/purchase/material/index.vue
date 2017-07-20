<template>
  <div>
    <el-breadcrumb class="_mb2">
      <el-breadcrumb-item>采购管理</el-breadcrumb-item>
      <el-breadcrumb-item>辅材采购管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click='handleAdd()'
               type='primary'>
      添加
    </el-button>
    <search class="_fr"
            v-model='searchField'
            :fields='searchFields'
            :table-data='list'
            :map="searchMap"
            :filter-table-data.sync='filterTableData'>
    </search>
  
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
  
      <el-table-column label="供应商"
                       sortable
                       class-name='_text'>
        <template scope='scope'>
          {{scope.row.purchaseSupplier.company}}
        </template>
      </el-table-column>
  
      <el-table-column label="辅材规格"
                       class-name='_text'>
        <template scope='scope'>
          {{scope.row.quotaAuxiliaryMaterial.name}}
        </template>
      </el-table-column>
  
      <el-table-column label="品牌"
                       sortable
                       prop='brand'
                       width="150">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       prop='brand'
                       :fn='update'
                       type='text'>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="辅材型号"
                       prop='model'
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       prop='model'
                       :fn='update'
                       type='text'>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="采购价格(元)"
                       prop='packPrice'
                       sortable
                       width="130">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       prop='packPrice'
                       :fn='update'
                       type='number'>
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
                       :fn='update'
                       type='text'>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="包装含量"
                       prop='specAmount'
                       sortable
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       prop='specAmount'
                       :fn='update'
                       type='number'>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="单价"
                       prop='specPrice'
                       sortable
                       class-name="_text"
                       width="100">
      </el-table-column>
  
      <el-table-column label="启用"
                       class-name="_text"
                       width="60">
        <template scope='scope'>
          <inline-edit type='select'
                       :data='scope.row'
                       :fn='update'
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
                     :loading='$isAjax.delete && scope.row.id=== currentDelId'
                     type="danger"
                     @click="handleDelete(scope.row)">删除</el-button>
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
        <h4>采购信息</h4>
        <hr>
        <el-form-item label='供应商'
                      class="_mt1">
          <el-select v-model='row.purchaseSupplierId'>
            <el-option v-for='s in suppliers'
                       :label='s.company'
                       :value='s.id'
                       :key='s.id'>
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label='辅材规格'>
          <el-select v-model="auxGroup">
            <el-option v-for="(list,auxType) in auxmaterialGroupList"
                       :key="auxType"
                       :value="auxType">
  
            </el-option>
          </el-select>
          <el-select v-if="auxGroup"
                     v-model="row.quotaAuxiliaryMaterialId">
            <el-option v-for="item in auxmaterialGroupList[auxGroup]"
                       :key="item.id"
                       :value="item.id"
                       :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label='品牌'>
          <el-input placeholder='请输入包装品牌(如：多乐士)'
                    v-model='row.brand'></el-input>
        </el-form-item>
  
        <el-form-item label='辅材型号'
                      prop="model">
          <el-input placeholder='请输入辅材型号(必填)(如：五合一)'
                    v-model='row.model'>
          </el-input>
        </el-form-item>
  
        <el-form-item label='采购价格'>
          <el-input-number placeholder='请输入采购价格'
                           :debounce="1000"
                           :step='10'
                           v-model='row.packPrice'>
          </el-input-number>
          <span class="_ml2">元</span>
          <span class="_ml1">[步进10]</span>
        </el-form-item>
  
        <h4>包装信息</h4>
        <hr>
        <el-form-item label='包装单位'
                      class="_mt1">
          <el-input placeholder='请输入包装单位(袋,包)'
                    v-model='row.packUnit'>
          </el-input>
        </el-form-item>
  
        <el-form-item label='包装含量'>
          <el-input-number placeholder='请输入规格数量'
                           :min='0'
                           :step='10'
                           :debounce="1000"
                           v-model='row.specAmount'>
          </el-input-number>
          <span class="_ml1">[步进10]</span>
        </el-form-item>
  
        <el-form-item label='单价'>
          <span class="_text">{{(row.packPrice / row.specAmount).toFixed(3)}}</span>
          <span class="_ml2">元</span>
          <span class="_ml1 _text">[ = 采购价格 / 包装含量 ]</span>
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
      auxGroup: '',
      // edit && del

      // dialog
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
    this.init()
  },
  computed: {
    ...mapGetters('purchase/material', ['$isAjax', 'list', 'currentDelId']),
    ...mapGetters('quota/auxmaterial', {
      auxmaterials: 'list',
      auxmaterialMap: 'map',
      auxmaterialGroupList: 'groupList'
    }),
    ...mapGetters('purchase/supplier', {
      suppliers: 'list',
      supplierMap: 'map',
    }),
    sliceTableData () {
      return this.$utils.getPage(this.filterTableData, this.pageSize, this.currentPage)
    },
    // 搜索 id->name 映射表
    searchMap () {
      return {
        purchaseSupplierId: this.supplierMap,
        quotaAuxiliaryMaterialId: this.auxmaterialMap
      }
    }
  },
  methods: {
    ...mapActions('purchase/material', ['init', 'create', 'update', 'delete']),
    // table methods
    handleAdd () {
      this.row = this.$utils.deepCopy(this.initialRow)
      this.showDialog = true
    },
    handleDelete (row) {
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
    // dialog methods
    submitAdd (row) {
      this.create(row).then(() => {
        this.$message.success("添加成功")
        this.closeDialog()
        this.$nextTick(() => {
          this.currentPage = Math.ceil(this.filterTableData.length / this.pageSize)
        })
      })
    },
    closeDialog () {
      this.showDialog = false
    }
  }
}
</script>