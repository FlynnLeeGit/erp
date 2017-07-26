<template>
  <el-table style="width=100%;"
            v-show='tableData.length'
            border
            :data='tableData'>
    <el-table-column label='id'
                     width='100'>
      <template scope='artScope'>
        <span class="_text"
              v-text='artScope.row.id'></span>
      </template>
    </el-table-column>
    <el-table-column label='计量(可编辑)'
                     width='180'>
      <template scope='scope'>
        <inline-edit :data='scope.row'
                     prop='counter'
                     :fn='editFn'>
        </inline-edit>
      </template>
    </el-table-column>
    <el-table-column label='材质' class-name="_text">
      <template scope='scope'>
       {{scope.row.quotaAuxiliaryMaterial.name}}
      </template>
    </el-table-column>
    <el-table-column label='规格' class-name="_text">
      <template scope='scope'>
        {{scope.row.materialSpec}}
      </template>
    </el-table-column>
    <el-table-column label='品牌'>
      <template scope='scope'>
        <span class="_text">{{scope.row.brand}}</span>
      </template>
    </el-table-column>
    <el-table-column label='型号'>
      <template scope='scope'>
        <span class="_text">{{scope.row.model}}</span>
      </template>
    </el-table-column>
    <el-table-column label="参考价"
                     class-name="_text">
      <template scope="scope">
        {{scope.row.referencePrice}} 元 [价格策略:{{map.calcStrategy[scope.row.quotaAuxiliaryMaterial.calcStrategy]}}]
      </template>
    </el-table-column>
    <el-table-column label='操作'
                     width='100'
                     align='center'>
      <template scope='scope'>
        <el-button size='mini'
                   @click='handleDelete(scope.row)'
                   :loading='$isAjax.delete_auxmaterial_count && qid === currentDelQid && currentDelAuxId===scope.row.id'
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
    ...mapGetters('quota/quota', ['$isAjax', 'currentDelQid', 'currentDelAuxId']),
    ...mapGetters('quota', ['map'])
  },
  methods: {
    ...mapActions('quota/quota', ['update_auxmaterial_count', 'delete_auxmaterial_count']),
    handleDelete (row) {
      this.$confirm('确认删除辅材计量?')
        .then(() => {
          this.delete_auxmaterial_count({ qid: this.qid, auxId: row.id }).then(() => {
            this.$message.success('删除辅材计量成功')
          })
        })
    },
    editFn (editRow) {
      return this.update_auxmaterial_count({
        qid: this.qid,
        data: editRow
      })
    }
  }
}
</script>
