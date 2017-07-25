<template>
  <div>
    <el-breadcrumb class="_mb2">
      <el-breadcrumb-item>定额管理</el-breadcrumb-item>
      <el-breadcrumb-item>定额模版</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click='handleAdd()'
               type='primary'>
      添加定额
    </el-button>
    <el-button @click='release'
               :loading='$isAjax.RELEASE_QUOTA'
               type='success'>
      发布定额版本
    </el-button>
  
    <search class="_fr"
            v-model='searchField'
            :fields='searchFields'
            :table-data='list'
            :filter-table-data.sync='filterTableData'>
    </search>
    <el-table v-loading='$isAjax.init'
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
                       :fn='update'
                       :direct-modify='false'
                       prop='name'>
          </inline-edit>
        </template>
      </el-table-column>
  
      <el-table-column label="大类"
                       show-overflow-tooltip
                       width='100'>
        <template scope='scope'>
          <inline-edit :data='scope.row'
                       :fn='update'
                       :direct-modify='false'
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
                       :fn='update'
                       :direct-modify='false'
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
                       :fn='update'
                       :direct-modify='false'
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
                       :fn='update'
                       :direct-modify='false'
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
                       :fn='update'
                       :direct-modify='false'
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
                       :fn='update'>
            {{scope.row.wastage}}%
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
                       width="240">
        <template scope="scope">
          <el-button size="mini"
                     type='success'
                     @click="addArtficial(scope.row)">
            <i class="el-icon-plus"></i>人工计量
          </el-button>
          <el-button size="mini"
                     type="success"
                     @click="addAuxmaterial(scope.row)">
            <i class="el-icon-plus"></i>辅材计量
          </el-button>
          <el-button size='mini'
                     type='danger'
                     :loading='$isAjax.delete && scope.row.id === currentDelId'
                     @click='handleDelete(scope.row)'>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!--pagination-->
    <el-pagination class="_mt2"
                   :page-sizes='[50,100,300,500]'
                   :total='filterTableData.length'
                   :current-page.sync="currentPage"
                   layout='total,sizes,prev,pager,next,jumper'
                   :page-size='pageSize'
                   @size-change='handleSizeChange'>
    </el-pagination>
  
    <dialog-quota ref="dialogQuota"
                  @created='handleQuotaCreated'>
    </dialog-quota>
  
    <dialog-art ref='dialogArt'></dialog-art>
    <dialog-aux ref='dialogAux'></dialog-aux>
  
  </div>
</template>

<script>
import expand from './_expand.vue'
import dialogQuota from './_dialog-quota.vue'
import dialogArt from './_dialog-art.vue'
import dialogAux from './_dialog-aux.vue'

import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    expand,
    dialogQuota,
    dialogArt,
    dialogAux
  },
  data () {
    return {
      // table
      filterTableData: [],
      // table loading status

      // pagination
      currentPage: 1,
      pageSize: 50,

      // search
      searchField: '',
      searchFields: ['id', 'name', 'type', 'stage', 'secType', 'unit', 'workType', 'wastage', 'position', 'content', 'description'],
      // artTable
    }
  },
  created () {
    this.init()
    // this.$root.$on('quota.quota.update', this.$utils.replaceObjectFields)
  },
  computed: {
    ...mapGetters('quota/quota', ['$isAjax', 'list', 'currentDelId']),
    ...mapGetters('quota', ['map']),
    sliceTableData () {
      return this.$utils.getPage(this.filterTableData, this.pageSize, this.currentPage)
    }
  },
  methods: {
    ...mapActions('quota/quota', ['init', 'update', 'delete', 'release_quota']),
    beforeUpdateType (editRow) {
      editRow.secType = ''
    },
    // table methods
    // 更新定额相关价格
    handleAdd () {
      this.$refs.dialogQuota.open()
    },
    handleQuotaCreated () {
      this.$nextTick(() => {
        this.currentPage = Math.ceil(this.filterTableData.length / this.pageSize)
      })
    },
    handleDelete (row) {
      this.$confirm(`确认删除定额项  ${row.name}？`).then(() => {
        this.delete(row.id).then(() => {
          this.$message.success('删除成功')
        })
      })
    },
    addArtficial (row) {
      this.$refs.dialogArt.open(row)
    },
    addAuxmaterial (row) {
      this.$refs.dialogAux.open(row)
    },
    // pagination
    handleSizeChange (val) {
      this.pageSize = val
    },
    release () {
      this.$prompt('请输入本次版本提交信息描述').then(({ value }) => {
        this.$notify({
          type: 'info',
          message: '提交版本会比较占用时间 请耐心等待至发布结束'
        })
        this.release_quota({
          description: value
        }).then(({ data }) => {
          this.$notify({
            type: 'info',
            title: '发布成功！',
            message: `版本号为${data.version}`
          })
        })
      })
    }
  }
}
</script>

