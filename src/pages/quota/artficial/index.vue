<template>
  <div>
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
    <el-table v-loading='$isAjax.INIT'
              :data="sliceTableData"
              border
              class="_mt2"
              highlight-current-row
              :default-sort="{prop: 'id'}"
              style="width: 100%">
      <el-table-column label="＃"
                       sortable
                       prop='id'
                       width="80">
      </el-table-column>
      <el-table-column label="工种"
                       sortable
                       prop='workType'
                       :sort-method="$utils.sortByChs.bind(this,'workType')"
                       width="180">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='edit'
                       type='select'
                       :direct-modify='false'
                       prop='workType'>
            <template slot='options'>
              <option v-for='(w,wIdx) in map.workType'
                      :key='wIdx'
                      v-text='w'>
              </option>
            </template>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="价格(元)"
                       prop='price'
                       sortable
                       width="100">
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :direct-modify='false'
                       :fn='edit'
                       type='number'
                       prop='price'>
          </inline-edit>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width='160'>
        <template scope="scope">
          <el-button size="mini"
                     :loading='$isAjax.DELETE && scope.row.id === currentDelId'
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
    <el-dialog title='添加人工'
               @keyup.enter.native='submitAdd(row)'
               :visible.sync='showDialog'>
      <el-form :model='row'
               :rules='formRules'
               label-width='80px'>
        <el-form-item label='工种'
                      prop='workType'>
          <el-select v-model='row.workType'>
            <el-option v-for='(w,wIdx) in map.workType'
                       :key='wIdx'
                       :value='w'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='价格'>
          <el-input-number v-model.number='row.price'
                           :debounce='800'
                           :min='0'
                           :step='10'>
          </el-input-number>
          <span class="_ml1">[步进10]</span>
          <span class="_ml2">元</span>
        </el-form-item>
  
      </el-form>
      <div slot='footer'
           class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="success"
                   :loading='$isAjax.CREATE'
                   @click="submitAdd(row)">
          添 加
        </el-button>
      </div>
    </el-dialog>
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
        workType: '',
        price: 0
      },
      // dialog
      showDialog: false,

      // pagination
      currentPage: 1,
      pageSize: 50,

      // search
      searchField: '',
      searchFields: ['id', 'workType', 'price'],

      formRules: {
        workType: [
          { required: true, message: '请输入工种名称', trigger: 'blur' },
        ]
      }
    }
  },
  created () {
    this.INIT()
  },
  computed: {
    ...mapGetters('quota/artficial', ['$isAjax', 'currentDelId', 'list']),
    ...mapGetters('quota', ['map']),
    sliceTableData () {
      return this.$utils.getPage(this.filterTableData, this.pageSize, this.currentPage)
    },
  },
  methods: {
    ...mapActions('quota/artficial', ['INIT', 'CREATE', 'UPDATE', 'DELETE']),
    edit (editRow) {
      return this.UPDATE(editRow)
    },
    // table methods
    handleAdd () {
      this.row = this.$utils.deepCopy(this.initialRow)
      this.showDialog = true
    },
    handleDelete (index, row) {
      this.$confirm('确认删除？')
        .then(() => {
          this.DELETE(row.id).then(() => {
            this.$message.success('删除人工成功！')
          })
        })
    },
    // pagination
    handleSizeChange (val) {
      this.pageSize = val
    },
    // dialog methods
    submitAdd (data) {
      this.CREATE(data).then(() => {
        this.$message.success("添加成功")
        this.cancelDialog()
        this.$nextTick(() => {
          this.currentPage = Math.ceil(this.filterTableData.length / this.pageSize)
        })
      })
    },
    cancelDialog () {
      this.showDialog = false
    }
  }
}
</script>