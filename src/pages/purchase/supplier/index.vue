<template>
  <div>
    <el-breadcrumb class="_mb2">
      <el-breadcrumb-item>采购管理</el-breadcrumb-item>
      <el-breadcrumb-item>供应商</el-breadcrumb-item>
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
      <el-table-column label="公司"
                       sortable
                       :sort-method="$utils.sortByChs.bind(null,'company')"
                       prop='company'
                       width="180">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       prop='company'
                       type='text'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="联系人"
                       prop='contact'
                       sortable
                       :sort-method="$utils.sortByChs.bind(null,'contact')"
                       width="150">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       prop='contact'
                       type='text'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="手机号"
                       prop='mobile'
                       sortable
                       :sort-method="$utils.sortByChs.bind(null,'mobile')"
                       width="150">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       prop='mobile'
                       type='text'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="备注"
                       :sort-method="$utils.sortByChs.bind(null,'note')"
                       prop='note'
                       sortable>
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       prop='note'
                       type='text'>
          </inline-edit>
        </template>
      </el-table-column>
      <!-- <el-table-column label='使用此供应商材料'>
                                    <template scope='scope'>
                                      <div v-if='scope.row.purchaseMaterials.length'>
                                        <el-tag type='primary'
                                                v-for='m in scope.row.purchaseMaterials'
                                                :key='m.id'>
                                          {{m.brand}}-[{{m.model}}]
                                        </el-tag>
                                      </div>
                                      <el-tag v-else
                                              type='gray'>
                                        无
                                      </el-tag>
                                    </template>
                                  </el-table-column> -->
      <el-table-column label="操作"
                       width='160'>
        <template scope="scope">
  
          <el-button size="mini"
                     :loading='$isAjax.delete && scope.row.id === currentDelId'
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
    <dialog-wrapper title='供应商'
                    mode='add'
                    v-model='showDialog'
                    :loading='$isAjax.create'
                    @submit='submitAdd(row)'>
      <el-form :model='row'
               :rules='rules'
               label-width='80px'>
        <el-form-item label='公司'
                      prop="company">
          <el-input v-focus
                    v-if="showDialog"
                    placeholder='请输入供应商公司名称'
                    v-model='row.company'></el-input>
        </el-form-item>
        <el-form-item label='联系人'
                      prop="contact">
          <el-input placeholder='请输入供应商联系人'
                    v-model='row.contact'></el-input>
        </el-form-item>
        <el-form-item label='手机号'
                      prop="mobile">
          <el-input placeholder='请输入供应商手机号'
                    v-model='row.mobile'></el-input>
        </el-form-item>
        <el-form-item label='备注'
                      prop="note">
          <el-input type='textarea'
                    :rows='3'
                    placeholder='请输入备注'
                    v-model='row.note'>
          </el-input>
        </el-form-item>
  
      </el-form>
  
    </dialog-wrapper>
  
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      // table
      filterTableData: [],
      row: {},
      initialRow: {
        company: '',
        contact: '',
        mobile: '',
        note: ''
      },
      // dialog
      showDialog: false,

      // pagination
      currentPage: 1,
      pageSize: 50,

      // search
      searchField: '',
      searchFields: ['id', 'company', 'contact', 'mobile', 'note'],
      rules: {
        company: [
          { required: true, message: '公司名称不能为空' }
        ],
        contact: [
          { required: true, message: '联系人不能为空' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空' }
        ]
      }
    }
  },
  created () {
    this.init()
  },
  computed: {
    ...mapGetters('purchase/supplier', ['$isAjax', 'list', 'currentDelId']),
    sliceTableData () {
      return this.$utils.getPage(this.filterTableData, this.pageSize, this.currentPage)
    },
  },
  methods: {
    ...mapActions('purchase/supplier', ['init', 'create', 'update', 'delete']),
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
    submitAdd (data) {
      this.create(data).then(() => {
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