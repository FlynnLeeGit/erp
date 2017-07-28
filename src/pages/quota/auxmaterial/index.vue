<template>
  <div>
    <el-breadcrumb class="_mb2">
      <el-breadcrumb-item>定额管理</el-breadcrumb-item>
      <el-breadcrumb-item>定额辅材材质</el-breadcrumb-item>
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
      <el-table-column label="名称"
                       sortable
                       prop='name'
                       :sort-method="$utils.sortByChs.bind(this,'name')"
                       width="350">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       type='text'
                       prop='name'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="定额单位"
                       sortable
                       prop='specUnit'
                       :sort-method="$utils.sortByChs.bind(this,'specUnit')"
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       type='text'
                       prop='specUnit'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="类型"
                       sortable
                       prop='type'
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       type='select'
                       prop='type'>
            <template slot='options'>
              <option v-for='t in map.specType'
                      :key='t'
                      :value='t'
                      v-text='t'>
              </option>
            </template>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="规格[限制单价]">
        <template scope="scope">
          <el-tag class="_ml1 _pointer"
                  closable
                  type="primary"
                  @click.native="handleUpdateSpec('edit',scope.row.id,spec)"
                  @close.stop='handleDeleteSpec(scope.row.id,spec.id)'
                  v-for="spec in scope.row.quotaAuxiliaryMaterialSpecs"
                  :key="spec.id">
            {{spec.name}}-[{{spec.limitPrice}}元]
          </el-tag>
        </template>
  
      </el-table-column>
      <el-table-column label="操作"
                       width='160'>
        <template scope="scope">
          <el-button @click="handleAddSpec('add',scope.row.id)"
                     size="mini"
                     type="success">
            <i class="fa fa-plus"></i>
            添加规格
          </el-button>
          <el-button size="mini"
                     :loading='$isAjax.delete && scope.row.id === currentDelId'
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">
            删除
          </el-button>
  
        </template>
      </el-table-column>
    </el-table>
  
    <!--pagination-->
    <el-pagination class="_mt2"
                   :page-sizes='[20,50,100,200]'
                   :total='filterTableData.length'
                   :current-page.sync="currentPage"
                   layout='total,sizes,prev,pager,next,jumper'
                   :page-size='pageSize'
                   @size-change='handleSizeChange'>
    </el-pagination>
  
    <dialog-wrapper title='辅材材质'
                    v-model="showDialog"
                    mode='add'
                    :loading='$isAjax.create'
                    @submit="submitAdd(row)">
      <el-form ref='form'
               :model='row'
               :rules='formRules'
               label-width='120px'>
        <el-form-item label='名称'
                      prop='name'>
          <el-input v-if="showDialog"
                    v-focus
                    placeholder='请输入材质名称'
                    v-model='row.name'></el-input>
        </el-form-item>
        <el-form-item label='定额单位'>
          <el-input placeholder='材质使用单位(m,kg等)'
                    v-model='row.specUnit'></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="row.type"
                     placeholder="请选择类型">
            <el-option v-for="t in map.specType"
                       :key="t"
                       :value='t'
                       :label='t'>
  
            </el-option>
          </el-select>
  
        </el-form-item>
  
      </el-form>
  
    </dialog-wrapper>
  
    <spec-dialog ref="specDialog"></spec-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import specDialog from './_spec-dialog.vue'

export default {
  components: {
    specDialog
  },
  data () {
    return {
      test: ['', '', ''],
      // table
      filterTableData: [],
      row: {},
      initialRow: {
        name: '',
        specUnit: '',
        type: '',
        specDesc: '',
        calcStrategy: '1',
      },
      // edit && del

      // dialog
      showDialog: false,

      // pagination
      currentPage: 1,
      pageSize: 20,

      // search
      searchField: '',
      searchFields: ['id', 'name', 'specUnit', 'type'],

      formRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ]
      }
    }
  },
  created () {
    this.init()
  },
  computed: {
    ...mapGetters('quota/auxmaterial', ['$isAjax', 'list', 'currentDelId']),
    ...mapGetters('quota', ['map']),
    sliceTableData () {
      return this.$utils.getPage(this.filterTableData, this.pageSize, this.currentPage)
    }
  },
  methods: {
    ...mapActions('quota/auxmaterial', ['init', 'create', 'update', 'delete', 'delete_spec']),
    // table methods
    calcStrategyFormatter (row) {
      return this.map.calcStrategy[row.calcStrategy]
    },
    handleAdd () {
      this.row = this.$utils.deepCopy(this.initialRow)
      this.showDialog = true
    },
    handleDelete (index, row) {
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
    closeDialog () {
      this.showDialog = false
    },
    submitAdd (data) {
      this.create(data).then(() => {
        this.$message.success("添加成功")
        this.closeDialog()
        this.$nextTick(() => {
          this.currentPage = Math.ceil(this.filterTableData.length / this.pageSize)
        })
      })
    },
    handleAddSpec (opt, auxId) {
      this.$refs.specDialog.open(opt, auxId)
    },
    handleUpdateSpec (opt, auxId, data) {
      this.$refs.specDialog.open(opt, auxId, data)
    },
    handleDeleteSpec (auxId, specId) {
      this.$confirm('是否删除此规格？').then(() => {
        this.delete_spec({
          auxId,
          specId
        }).then(() => {
          this.$message.success("删除规格成功")
        })
      })
    }
  }
}
</script>