<template>
  <el-table v-show='hasCounters'
            style="width=100%;"
            border
            :data='tableData'>
    <el-table-column label='id'
                     width='100'>
      <template scope='artScope'>
        <span class="_text"
              v-text='artScope.row.id'>
        </span>
      </template>
  
    </el-table-column>
    <el-table-column label='人工 计量(可编辑)'
                     width='180'>
      <template scope='artScope'>
        <inline-edit :data='artScope.row'
                     prop='counter'
                     :fn='editFn'
                     :direct-modify='false'
                     @updated='update'>
        </inline-edit>
      </template>
    </el-table-column>
    <el-table-column label='人工 工种'
                     prop='counter'>
      <template scope='artScope'>
        <span class="_text">{{artScope.row.quotaArtficial.workType}}</span>
      </template>
    </el-table-column>
    <el-table-column label='人工 价格'
                     prop='counter'>
      <template scope='artScope'>
        <span class="_text">{{artScope.row.quotaArtficial.price}}</span>
      </template>
    </el-table-column>
    <el-table-column label='操作'
                     width='100'
                     align='center'>
      <template scope='scope'>
        <el-button size='mini'
                   @click='del(scope.$index,scope.row)'
                   type='danger'>
          删除
        </el-button>
      </template>
    </el-table-column>
  
  </el-table>
</template>
<script>
import { delArt, editArt } from './api'

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    qid: {
      type: Number
    }
  },
  computed: {
    hasCounters () {
      return this.tableData.length
    },
  },
  methods: {
    editArt,
    del ($index, row) {
      this.$confirm('确认删除辅材计量?')
        .then(() => {
          return delArt(this.qid, row.id)
        })
        .then(({ data }) => {
          this.$message.success('删除辅材计量成功')
          this.update(data)
        })
    },
    // 返回promise对象,让其在inlineEdit中执行
    editFn (editRow) {
      return editArt(this.qid, editRow)
    },
    update (data) {
      this.$emit('update', data)
    }
  }
}
</script>

