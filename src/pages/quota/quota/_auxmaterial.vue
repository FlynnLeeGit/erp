<template>
  <el-table style="width=100%;"
            v-show='hasCounters'
            border
            :data='tableData'>
    <el-table-column label='id'
                     width='100'>
      <template scope='artScope'>
        <span class="_text"
              v-text='artScope.row.id'></span>
      </template>
    </el-table-column>
    <el-table-column label='辅材 计量(可编辑)'
                     width='180'>
      <template scope='scope'>
        <inline-edit :data='scope.row'
                     prop='counter'
                     :fn='editFn'
                     :direct-modify='false'
                     @updated='update'>
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
        <span class="_text">{{scope.row.quotaAuxiliaryMaterial.specUnit}}</span>
      </template>
    </el-table-column>
    <el-table-column label='辅材 描述'>
      <template scope='scope'>
        <span class="_text">{{scope.row.quotaAuxiliaryMaterial.specDesc}}</span>
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
    },
    qid: {
      type: Number
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
          return delMat(this.qid, row.id)
        })
        .then(({ data }) => {
          this.$message.success('删除辅材计量成功')
          this.update(data)
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    editFn (editRow) {
      return editMat(this.qid, editRow)
    },
    update (data) {
      this.$emit('update', data)
    }
  }
}
</script>
