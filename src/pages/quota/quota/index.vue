<template>
  <div>
    <el-button @click='handleAdd()'
               type='primary'>
      添加定额
    </el-button>
    <search class="_fr"
            v-model='searchField'
            :fields='searchFields'
            :table-data='tableData'
            :filter-table-data.sync='filterTableData'>
    </search>
    <el-table v-loading='isFetching'
              :data="sliceTableData"
              class="_mt2"
              :default-sort="{prop: 'id'}"
              style="width: 100%;">
  
      <el-table-column type='expand'>
        <template scope='scope'>
          <expand :row='scope.row' />
        </template>
      </el-table-column>
      <el-table-column label="＃"
                       sortable
                       prop='id'
                       width="60">
      </el-table-column>
      <el-table-column label="名称"
                       sortable
                       prop='name'
                       width="200">
      </el-table-column>
      <el-table-column label='人工费用'
                       sortable
                       width='200'
                       prop='name'
                       class-name='_text'
                       :formatter='formatter'>
      </el-table-column>
      <el-table-column label='辅材费用'
                       width='200'>
        <template scope='scope'>
          <span class="_text">{{scope.row.sec_type + '333' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size='mini'
                     @click='handleEdit(scope.$index,scope.row)'>
            编辑定额
          </el-button>
          <el-button size='mini'
                     type='danger'
                     @click='handleDelete(scope.$index,scope.row)'>
            删除定额
          </el-button>
          <el-button size="mini"
                     type='success'
                     @click="addArtficial(scope.$index, scope.row)">
            <i class="el-icon-plus"></i> 人工
          </el-button>
          <el-button size="mini"
                     type="success"
                     @click="addMaterial(scope.$index, scope.row)">
            <i class="el-icon-plus"></i> 辅材
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!--pagination-->
    <el-pagination class="_mt2"
                   :page-sizes='[100,300,500,1000]'
                   :total='filterTableData.length'
                   :current-page="currentPage"
                   layout='total,sizes,prev,pager,next,jumper'
                   :page-size='pageSize'
                   @current-change='handleCurrentChange'
                   @size-change='handleSizeChange'>
    </el-pagination>
  
    <dialog-quota ref='dialogQuota'
                  @added='quotaAdded'
                  :map='map'>
    </dialog-quota>
    <dialog-art ref='dialogArt'
                :map='artMap'>
    </dialog-art>
    <dialog-mat ref='dialogMat'
                :map='matMap'>
    </dialog-mat>
  </div>
</template>

<script>
import expand from './_expand.vue'
import dialogQuota from './_dialog-quota.vue'
import dialogArt from './_dialog-art.vue'
import dialogMat from './_dialog-mat.vue'
import Search from '@/components/Search.vue'
import { get, getArtList, getMatList, getMap, edit, del } from './api'
import { getPage, sort } from '@/plugins/utils'

export default {
  components: {
    expand,
    dialogQuota,
    dialogArt,
    dialogMat,
    Search
  },
  data () {
    return {
      // table
      tableData: [],
      map: {},
      filterTableData: [],
      // table loading status
      isFetching: false,
      isDeleting: false,

      // pagination
      currentPage: 1,
      pageSize: 100,

      // search
      searchField: '',
      searchFields: ['id', 'type', 'stage', 'sec_type', 'unit', 'work_type', 'wastage', 'position', 'content', 'description'],
      // artTable
      artMap: {
        artList: []
      },
      // matTable
      matMap: {
        matList: []
      }
    }
  },
  created () {
    this.initData()
  },
  computed: {
    sliceTableData () {
      return getPage(this.filterTableData, this.pageSize, this.currentPage)
    }
  },
  methods: {
    // api methods
    initData () {
      this.isFetching = true
      Promise.all([get(), getMap(), getArtList(), getMatList()])
        .then(([one, two, three, four]) => {
          // table
          this.tableData = one.data
          // map
          this.map = two.data.quota_template
          // art && mat
          this.artMap.artList = three.data
          this.matMap.matList = four.data
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    formatter (row, column) {
      return row.wastage * 100
    },
    // table methods
    handleAdd () {
      this.$refs.dialogQuota.open('add')
    },
    handleEdit ($index, row) {
      this.$refs.dialogQuota.open('edit', row)
    },
    quotaAdded (newQuota) {
      this.tableData.push(newQuota)
    },
    handleDelete (index, row) {
      this.$confirm(`确认删除定额项  ${row.name}？`)
        .then(() => {
          this.isDeleting = true
          return del(row.id)
        })
        .then(() => {
          const delIndex = this.tableData.indexOf(row)
          this.tableData.splice(delIndex, 1)
          this.$message.success('删除成功')
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    addArtficial ($index, row) {
      this.$refs.dialogArt.open(row)
    },
    addMaterial ($index, row) {
      this.$refs.dialogMat.open(row)
    },

    // pagination
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
  }
}
</script>
<style lang='scss'>

</style>
