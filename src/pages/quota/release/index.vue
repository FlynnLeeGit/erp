<template>
  <div>
    <el-breadcrumb class="_mb2">
      <el-breadcrumb-item>定额管理</el-breadcrumb-item>
      <el-breadcrumb-item>版本比对</el-breadcrumb-item>
    </el-breadcrumb>
    <el-select v-model="nextVersion"
               placeholder="请选择比较版本">
      <el-option v-for="v in listPlusLatest"
                 :key="v.version"
                 :value="v.version">
        <span style="float: left">{{ v.version }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">({{v.description}})</span>
      </el-option>
    </el-select>
    相对于
    <el-select v-model="prevVersion"
               placeholder="请选择版本">
      <el-option v-for="v in listPlusLatest"
                 :key="v.version"
                 :value="v.version">
        <span style="float: left">{{ v.version }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">({{v.description}})</span>
      </el-option>
    </el-select>
    <el-button type='primary'
               @click='diffVersion(prevVersion,nextVersion)'
               :loading='$isAjax.diff_version'>
      比较
    </el-button>
    <el-table class="_mt2"
              border
              empty-text="没有差别记录"
              :row-class-name='rowCls'
              v-loading='$isAjax.diff_version || $isAjax.init'
              style="width:100%"
              :data='diffTable'>
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
                       show-overflow-tooltip>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='type'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label="小类"
                       show-overflow-tooltip>
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
      <el-table-column label="损耗率(%)"
                       width="100">
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='wastage'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label='人工价'
                       width='100'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='artificialUnitPrice'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label='辅材价'
                       width='100'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='auxiliaryMaterialUnitPrice'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label='主材价'
                       width='100'>
        <template scope='scope'>
          <diff-cell :data='scope.row'
                     prop='principalMaterialUnitPrice'>
          </diff-cell>
        </template>
      </el-table-column>
      <el-table-column label='合计价'
                       width='100'
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
import diffTable from '@/plugins/diffTable'

import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      prevVersion: '',
      prevDesc: '',

      nextVersion: 'latest',
      nextDesc: '',
    }
  },
  computed: {
    ...mapGetters('quota/release', ['$isAjax', 'listPlusLatest', 'prevTableData', 'nextTableData']),
    diffTable () {
      return diffTable(this.prevTableData, this.nextTableData)
    }
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions('quota/release', ['init', 'diff_version']),
    rowCls (row) {
      if (row.diff.status === 'delete') {
        return 'danger-row'
      }
      if (row.diff.status === 'add') {
        return 'success-row'
      }
    },
    diffVersion (prevVersion, nextVersion) {
      this.diff_version({
        prevVersion,
        nextVersion
      }).then(() => {
        this.$message.success('比对完成')
      })
    }
  }
}
</script>


