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
          <expand :row='scope.row'>
          </expand>
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
      <el-table-column label='人工合计单价'
                       sortable
                       width='150'
                       prop='artificialUnitPrice'
                       class-name='_text'>
      </el-table-column>
      <el-table-column label='辅材合计单价'
                       sortable
                       width='150'
                       prop='auxiliaryMaterialUnitPrice'
                       class-name='_text'>
      </el-table-column>
      <el-table-column label='主材合计单价'
                       sortable
                       width='150'
                       prop='principalMaterialUnitPrice'
                       class-name='_text'>
      </el-table-column>
      <el-table-column label='合计单价'
                       sortable
                       width='150'
                       prop='totalUnitPrice'
                       class-name='_text'>
      </el-table-column>
  
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size='mini'
                     @click='handleEdit(scope.$index,scope.row)'>
            编辑
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
          <el-button size='mini'
                     type='danger'
                     @click='handleDelete(scope.$index,scope.row)'>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!--pagination-->
    <el-pagination class="_mt2"
                   :page-sizes='[5,100,300,500,1000]'
                   :total='filterTableData.length'
                   :current-page="currentPage"
                   layout='total,sizes,prev,pager,next,jumper'
                   :page-size='pageSize'
                   @current-change='handleCurrentChange'
                   @size-change='handleSizeChange'>
    </el-pagination>
  
    <dialog-quota ref='dialogQuota'
                  :map='map'
                  @added='quotaAdded'
                  @edited='quotaEdited'>
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
import { getPage, sort, replaceObjectFields } from '@/plugins/utils'

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
      pageSize: 5,

      // search
      searchField: '',
      searchFields: ['id', 'name', 'type', 'stage', 'secType', 'unit', 'workType', 'wastage', 'position', 'content', 'description'],
      // artTable
      artMap: {
        artList: []
      },
      // matTable
      matMap: {
        matList: []
      },

      // price related fields
      replaceFields: ['artificialUnitPrice', 'auxiliaryMaterialUnitPrice', 'principalMaterialUnitPrice', 'totalUnitPrice', 'quotaArtficialCounters', 'quotaAuxiliaryCounters']
    }
  },
  created () {
    this.initData()
    this.$root.$on('quota.quota.update', this.updateQuotaPrice)
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
    // table methods
    // 更新定额相关价格
    updateQuotaPrice (oldRow, newRow) {
      replaceObjectFields(oldRow, newRow, this.replaceFields)
    },
    handleAdd () {
      this.$refs.dialogQuota.open('add')
    },
    handleEdit ($index, row) {
      this.$refs.dialogQuota.open('edit', row)
    },
    quotaAdded (newQuota) {
      this.tableData.push(newQuota)
    },
    quotaEdited (oldQuota, newQuota) {
      console.log(oldQuota, newQuota)
      replaceObjectFields(oldQuota, newQuota, this.searchFields)
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
