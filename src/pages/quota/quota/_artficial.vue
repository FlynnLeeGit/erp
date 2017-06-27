<template>
  <el-table v-if='hasCounters'
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
    <el-table-column label='人工 计量'
                     width='180'>
      <template scope='artScope'>
        <inline-edit :data='artScope.row'
                     prop='counter'
                     :fn='editArt'
                     @success='handleArtSuccess'>
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
import InlineEdit from '@/components/InlineEdit.vue'
export default {
  components: {
    InlineEdit
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
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
          return delArt(row.id)
        })
        .then(() => {
          this.$message.success('删除辅材计量成功')
          this.tableData.splice($index, 1)
        })
    },
    handleArtSuccess (newRes) {
      console.log(newRes)
    }
  }
}
</script>

