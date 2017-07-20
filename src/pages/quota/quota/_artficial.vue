<template>
  <el-table v-show='tableData.length'
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
                     :direct-modify='false'>
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
                   :loading="$isAjax.delete_artficial_count && qid===currentDelQid && scope.row.id === currentDelArtId"
                   @click='handleDelete(scope.row)'
                   type='danger'>
          删除
        </el-button>
      </template>
    </el-table-column>
  
  </el-table>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

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
    ...mapGetters('quota/quota', ['$isAjax', 'currentDelQid', 'currentDelArtId']),
  },
  methods: {
    ...mapActions('quota/quota', ['update_artficial_count', 'delete_artficial_count']),
    handleDelete (row) {
      this.$confirm('确认删除辅材计量?')
        .then(() => {
          this.delete_artficial_count({
            qid: this.qid,
            artId: row.id
          }).then(() => {
            this.$message.success('删除辅材计量成功')
          })
        })
    },
    // 返回promise对象,让其在inlineEdit中执行
    editFn (editRow) {
      return this.update_artficial_count({
        qid: this.qid,
        data: editRow
      })
    }
  }
}
</script>

