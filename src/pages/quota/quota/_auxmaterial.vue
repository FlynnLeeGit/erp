<template>
  <el-table style="width=100%;"
            v-if='hasCounters'
            border
            :data='tableData'>
    <el-table-column label='id'
                     width='100'>
      <template scope='artScope'>
        <span class="_text"
              v-text='artScope.row.id'></span>
      </template>
    </el-table-column>
    <el-table-column label='辅材 计量'
                     width='180'>
      <template scope='scope'>
        <inline-edit :data='scope.row'
                     prop='counter'
                     :fn='editMat'
                     @success='handleMatSuccess'>
        </inline-edit>
      </template>
    </el-table-column>
    <el-table-column label='辅材 名称'>
      <template scope='scope'>
        <span class="_text">{{scope.row.quotaAuxiliaryMaterial.name}}</span>
      </template>
    </el-table-column>
    <el-table-column label='辅材 单位'>
      <template scope='scope'>
        <span class="_text">{{scope.row.quotaAuxiliaryMaterial.unit}}</span>
      </template>
    </el-table-column>
    <el-table-column label='辅材 价格'>
      <template scope='scope'>
        <span class="_text">{{scope.row.quotaAuxiliaryMaterial.price}}</span>
      </template>
    </el-table-column>
    <el-table-column label='辅材 品牌'>
      <template scope='scope'>
        <span class="_text">{{scope.row.quotaAuxiliaryMaterial.brand}}</span>
      </template>
    </el-table-column>
    <el-table-column label='操作'
                     width='100'
                     align='center'>
      <template scope='scope'>
        <el-button size='mini'
                   @click='del(scope.$index,scope.row)'
                   :loading='isDeleting && deleteRowId===scope.row.id'
                   type='danger'>
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { delMat, editMat } from './api'
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
  data () {
    return {
      isDeleting: false,
      deleteRowId: 0,
    }
  },
  computed: {
    hasCounters () {
      return this.tableData.length
    }
  },
  methods: {
    editMat,
    del ($index, row) {
      this.$confirm('确认删除辅材计量?')
        .then(() => {
          this.isDeleting = true
          this.deleteRowId = row.id
          return delMat(row.id)
        })
        .then(() => {
          this.$message.success('删除辅材计量成功')
          this.tableData.splice($index, 1)
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    handleMatSuccess (newQuota) {
      console.log(newQuota)
    }
  }
}
</script>
