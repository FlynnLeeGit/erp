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
                       sortable>
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       type='select'
                       prop='purchaseSupplier.id'
                       :fn='update'>
            {{scope.row.purchaseSupplier.company}}
            <template slot='options'>
              <option v-for='s in suppliers'
                      :label='s.company'
                      :value='s.id'
                      :key='s.id'>
              </option>
            </template>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="辅材材质与规格">
        <template scope='scope'>
          <el-button type="default"
                     class="_fr"
                     size="mini"
                     @click="handleOpenAuxDialog(scope.row)">更换</el-button>
          {{formatterSpec(scope.row.quotaAuxiliaryMaterialSpec)}}
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
  
      <el-table-column label="型号"
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
    <dialog-wrapper title='辅材'
                    :loading='$isAjax.create'
                    @submit="submitAdd(row)"
                    v-model='showDialog'>
      <el-form :model='row'
               :rules="rules"
               label-width="80px">
        <h4>采购信息</h4>
        <hr>
        <el-form-item label='供应商'
                      class="_mt1">
          <el-select v-model='row.purchaseSupplier.id'>
            <el-option v-for='s in suppliers'
                       :label='s.company'
                       :value='s.id'
                       :key='s.id'>
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label='辅材规格'>
          <el-cascader :options="cascaderOpts"
                       v-model="auxModel">
          </el-cascader>
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
    </dialog-wrapper>
  
    <dialog-wrapper v-model="showAuxDialog"
                    :loading='$isAjax.update'
                    title="规格"
                    mode='edit'
                    @submit='submitUpdate(row)'>
      <el-form label-width="80px">
        <el-form-item label="更换规格">
          <el-cascader :options="cascaderOpts"
                       v-model="auxModel">
          </el-cascader>
        </el-form-item>
      </el-form>
    </dialog-wrapper>
  
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      // table
      filterTableData: [],
      row: {
        quotaAuxiliaryMaterialSpec: {
          id: ''
        },
        purchaseSupplier: {
          id: ''
        }
      },
      initialRow: {
        quotaAuxiliaryMaterialSpec: {
          id: ''
        },
        purchaseSupplier: {
          id: ''
        },
        packUnit: '',
        packPrice: 0,


        specAmount: 10,
        specPrice: 0,
        brand: '',
        model: '',

        isEnable: true
      },
      auxModel: ['', '', ''],

      // edit && del

      // dialog
      showDialog: false,
      showAuxDialog: false,

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
      auxmaterialMap: 'map',
      // auxmaterialOptions: 'options',
      auxmaterialSpecOpts: 'specOpts',
      auxmaterialAuxOpts: 'auxOpts',
      auxmaterialTypeOpts: 'typeOpts',
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
    },
    cascaderOpts () {
      return this.$utils.toCascader(this.auxmaterialTypeOpts, this.auxmaterialAuxOpts, this.auxmaterialSpecOpts)
    }
  },
  methods: {
    ...mapActions('purchase/material', ['init', 'create', 'update', 'delete']),
    formatterSpec (spec) {
      return spec && `${spec.name}[${spec.quotaAuxiliaryMaterial.name}]`
    },
    // table methods
    handleAdd () {
      this.row = this.$utils.deepCopy(this.initialRow)
      this.auxModel = ['', '', '']
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
      row.quotaAuxiliaryMaterialSpec.id = this.auxModel[2]
      this.create(row).then(() => {
        this.$message.success("添加成功")
        this.closeDialog()
        this.$nextTick(() => {
          this.currentPage = Math.ceil(this.filterTableData.length / this.pageSize)
        })
      })
    },
    handleOpenAuxDialog (row) {
      this.row = this.$utils.deepCopy(row)
      this.auxModel = ['', '', '']
      this.showAuxDialog = true
    },
    submitUpdate (row) {
      if (!row.quotaAuxiliaryMaterialSpec) {
        row.quotaAuxiliaryMaterialSpec = {}
      }
      row.quotaAuxiliaryMaterialSpec.id = this.auxModel[2]
      this.update(row).then(() => {
        this.$message.success('更换成功')
        this.closeAuxDialog()
      })
    },
    closeDialog () {
      this.showDialog = false
    },
    closeAuxDialog () {
      this.showAuxDialog = false
    }
  }
}
</script>