<template>
  <div>
    <el-select v-model="nextVersion"
               placeholder="请选择比较版本">
      <el-option v-for="v in OrderedVersionList"
                 :key="v.version"
                 :value="v.version">
        <span style="float: left">{{ v.version }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">({{v.description}})</span>
      </el-option>
    </el-select>
    相对于
    <el-select v-model="prevVersion"
               placeholder="请选择版本">
      <el-option v-for="v in OrderedVersionList"
                 :key="v.version"
                 :value="v.version">
        <span style="float: left">{{ v.version }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">({{v.description}})</span>
      </el-option>
    </el-select>
  
    <el-button type='primary'
               @click='diffVersion'
               :loading='isFetching'>
      比较
    </el-button>
    <el-table class="_mt2"
              border
              empty-text="没有差别记录"
              :row-class-name='rowCls'
              v-loading='isFetching'
              style="width:100%"
              :data='mergeTable'>
      <el-table-column label='diff'
                       align='center'
                       width='60'>
        <template scope='scope'>
  
          <el-tag type='success'
                  v-if="scope.row.diff.status==='add'">
            新增行
          </el-tag>
          <el-tag type='danger'
                  v-if="scope.row.diff.status==='delete'">
            删除行
          </el-tag>
          <el-tag type='primary'
                  v-if="scope.row.diff.status==='change'">
            更新行
          </el-tag>
  
        </template>
      </el-table-column>
  
      <el-table-column label='#'
                       prop='id'
                       width='50'>
      </el-table-column>
  
      <el-table-column label="名称"
                       show-overflow-tooltip
                       width='120'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='name'>
          </diff-cell>
        </template>
      </el-table-column>
  
      <el-table-column label="品牌"
                       show-overflow-tooltip
                       prop='brand'
                       width='50'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='brand'>
          </diff-cell>
        </template>
      </el-table-column>
  
      <el-table-column label="大类"
                       show-overflow-tooltip
                       width='100'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='type'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label="小类"
                       show-overflow-tooltip
                       width='100'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='secType'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label="单位"
                       width='50'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='unit'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label="位置"
                       show-overflow-tooltip
                       width='50'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='position'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label="阶段"
                       show-overflow-tooltip
                       width="60">
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='stage'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label="损耗率">
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='wastage'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label='人工价'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='artificialUnitPrice'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label='辅材价'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='auxiliaryMaterialUnitPrice'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label='主材价'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='principalMaterialUnitPrice'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label='合计价'
                       prop='totalUnitPrice'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='totalUnitPrice'>
          </diff-cell>
        </template>
      </el-table-column>
  
      <el-table-column label='说明'
                       show-overflow-tooltip
                       class-name="_text"
                       prop='description'>
      </el-table-column>
      <el-table-column label='工作内容'
                       show-overflow-tooltip
                       prop='content'
                       class-name="_text">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getVersionList, getLast, getByVersion, getQuota } from './api'
import mergeVersionTables from './mergeVersionTables'
import diffCell from './_diffCell.vue'

export default {
  components: {
    diffCell
  },
  data () {
    return {
      versionList: [],

      prevVersion: '',
      prevTableData: [],
      prevDesc: '',

      nextVersion: '',
      nextDesc: '',
      nextTableData: [],

      isFetching: false

    }
  },
  computed: {
    mergeTable () {
      return mergeVersionTables(this.prevTableData, this.nextTableData)
    },
    OrderedVersionList () {
      const sorted = this.versionList.sort((a, b) => b.version - a.version)
      sorted.unshift({
        version: 'latest',
        description: '正在编辑中的'
      })
      return sorted
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.isFetching = true
      Promise.all([getVersionList()])
        .then(([one]) => {
          this.versionList = one.data
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    rowCls (row) {
      if (row.diff.status === 'delete') {
        return 'danger-row'
      }
      if (row.diff.status === 'add') {
        return 'success-row'
      }
    },
    getQuotaData (version) {
      return version === 'latest' ? getQuota() : getByVersion(version)
    },
    diffVersion () {
      this.isFetching = true
      Promise.all([this.getQuotaData(this.prevVersion), this.getQuotaData(this.nextVersion)])
        .then(([one, two]) => {
          this.prevTableData = one.data
          this.nextTableData = two.data
        })
        .finally(() => {
          this.isFetching = false
        })
    }
  }
}
</script>


