<template>
  <el-row class="quota-content">
    <el-col :span='24'
            class="quota-content__col">
  
      <el-button @click='handleAdd()'
                 type='primary'>
        添加定额
      </el-button>
      <el-button @click='release'
                 :loading='isReleasing'
                 type='success'>
        发布定额版本
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
                border
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
                         show-overflow-tooltip
                         width='120'>
          <template scope='scope'>
            <inline-edit :data='scope.row'
                         type='text'
                         prop='name'
                         :fn='edit'>
            </inline-edit>
          </template>
        </el-table-column>
  
        <el-table-column label="品牌"
                         show-overflow-tooltip
                         width='50'>
          <template scope='scope'>
            <inline-edit :data='scope.row'
                         type='text'
                         prop='brand'
                         :fn='edit'>
            </inline-edit>
          </template>
        </el-table-column>
  
        <el-table-column label="大类"
                         show-overflow-tooltip
                         width='100'>
          <template scope='scope'>
            <inline-edit :data='scope.row'
                         :fn='edit'
                         type='select'
                         prop='type'
                         @before-update='beforeUpdateType'>
              <template slot='options'>
                <option v-for='(t,tIdx) in map.type'
                        :key='tIdx'>{{tIdx}}
                </option>
              </template>
            </inline-edit>
          </template>
        </el-table-column>
        <el-table-column label="小类"
                         show-overflow-tooltip
                         width='100'>
          <template scope='scope'>
            <inline-edit :data='scope.row'
                         :fn='edit'
                         type='select'
                         prop='secType'>
              <template slot='options'>
                <option v-for='(st,sIdx) in map.type[scope.row.type]'
                        :key='sIdx'>{{st}}
                </option>
              </template>
            </inline-edit>
          </template>
        </el-table-column>
        <el-table-column label="单位"
                         width='50'>
          <template scope='scope'>
            <inline-edit :data='scope.row'
                         :fn='edit'
                         type='select'
                         prop='unit'>
              <template slot='options'>
                <option v-for='(u,uIdx) in map.unit'
                        :key='uIdx'>{{u}}
                </option>
              </template>
            </inline-edit>
          </template>
        </el-table-column>
        <el-table-column label="位置"
                         show-overflow-tooltip
                         width='50'>
          <template scope='scope'>
            <inline-edit :data='scope.row'
                         :fn='edit'
                         type='select'
                         prop='position'>
              <template slot='options'>
                <option v-for='(p,pIdx) in map.position'
                        :key='pIdx'>{{p}}
                </option>
              </template>
            </inline-edit>
          </template>
        </el-table-column>
        <el-table-column label="阶段"
                         show-overflow-tooltip
                         width="60">
          <template scope='scope'>
            <inline-edit :data='scope.row'
                         :fn='edit'
                         type='select'
                         prop='stage'>
              <template slot='options'>
                <option v-for='(s,sIdx) in map.stage'
                        :key='sIdx'>{{s}}
                </option>
              </template>
            </inline-edit>
          </template>
        </el-table-column>
        <el-table-column label="损耗率"
                         prop='wastage'
                         sortable>
          <template scope='scope'>
            <inline-edit :data='scope.row'
                         prop='wastage'
                         :fn='edit'>
            </inline-edit>
          </template>
  
        </el-table-column>
        <el-table-column label='人工价'
                         sortable
                         prop='artificialUnitPrice'
                         class-name='_text'>
        </el-table-column>
        <el-table-column label='辅材价'
                         sortable
                         prop='auxiliaryMaterialUnitPrice'
                         class-name='_text'>
        </el-table-column>
        <el-table-column label='主材价'
                         sortable
                         prop='principalMaterialUnitPrice'
                         class-name='_text'>
        </el-table-column>
        <el-table-column label='合计价'
                         sortable
                         prop='totalUnitPrice'
                         class-name='_text'>
        </el-table-column>
  
        <el-table-column label="操作"
                         width="200">
          <template scope="scope">
            <el-button size="mini"
                       type='success'
                       @click="addArtficial(scope.$index, scope.row)">
              人工
            </el-button>
            <el-button size="mini"
                       type="success"
                       @click="addMaterial(scope.$index, scope.row)">
              辅材
            </el-button>
            <el-button size='mini'
                       type='danger'
                       :loading='isDeleting && scope.row.id === delId'
                       @click='handleDelete(scope.$index,scope.row)'>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!--pagination-->
      <el-pagination class="_mt2"
                     :page-sizes='[100,300,500,1000]'
                     :total='filterTableData.length'
                     :current-page.sync="currentPage"
                     layout='total,sizes,prev,pager,next,jumper'
                     :page-size='pageSize'
                     @size-change='handleSizeChange'>
      </el-pagination>
  
      <dialog-quota ref='dialogQuota'
                    :map='map'
                    @added='quotaAdded'>
      </dialog-quota>
      <dialog-art ref='dialogArt'
                  :map='artMap'>
      </dialog-art>
      <dialog-mat ref='dialogMat'
                  :map='matMap'>
      </dialog-mat>
    </el-col>
    <el-col :span='12'
            class="quota-content__col">
  
    </el-col>
  </el-row>
</template>

<script>
import expand from './_expand.vue'
import dialogQuota from './_dialog-quota.vue'
import dialogArt from './_dialog-art.vue'
import dialogMat from './_dialog-mat.vue'

import { get, getArtList, getMatList, getMap, edit, del, release } from './api'

export default {
  components: {
    expand,
    dialogQuota,
    dialogArt,
    dialogMat
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
      delId: 0,

      // pagination
      currentPage: 1,
      pageSize: 100,

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

      // release status
      isReleasing: false,
    }
  },
  created () {
    this.initData()
    this.$root.$on('quota.quota.update', this.$utils.replaceObjectFields)
  },
  computed: {
    sliceTableData () {
      return this.$utils.getPage(this.filterTableData, this.pageSize, this.currentPage)
    }
  },
  methods: {
    edit,
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
    beforeUpdateType (editRow) {
      editRow.secType = ''
    },
    // table methods
    // 更新定额相关价格
    handleAdd () {
      this.$refs.dialogQuota.open()
    },
    quotaAdded (newQuota) {
      this.tableData.push(newQuota)
      this.$nextTick(() => {
        this.currentPage = Math.ceil(this.filterTableData.length / this.pageSize)
      })
    },
    handleDelete (index, row) {
      this.$confirm(`确认删除定额项  ${row.name}？`)
        .then(() => {
          this.delId = row.id
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
    release () {
      this.$prompt('请输入本次版本提交信息描述').then(({ value }) => {
        this.isReleasing = true
        this.$notify({
          type: 'info',
          message: '提交版本会比较占用时间 请耐心等待至发布结束'
        })
        release({
          description: value
        })
          .then(({ data }) => {
            this.$notify({
              type: 'info',
              title: '发布成功！',
              message: `版本号为${data.version}`
            })
          })
          .finally(() => {
            this.isReleasing = false
          })
      })
    }
  }
}
</script>
<style lang="scss">
// .quota-content {
//   height: 100%;
//   &__col {
//     height: 100%;
//     overflow-y: scroll;
//   }
// }
</style>

