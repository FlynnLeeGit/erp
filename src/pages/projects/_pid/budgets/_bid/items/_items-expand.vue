<template>
  <div v-if='tableData.length'>
    <el-table style="width=100%;"
              border
              :data='tableData'>
      <el-table-column label='#'
                       prop="id"
                       width="60"
                       class-name="_text">
      </el-table-column>
  
      <el-table-column label="操作"
                       width="100"
                       align='center'>
        <template scope="scope">
          <el-button size="mini"
                     type="default"
                     @click="handleEditCounter(counterId)">
            更换
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label='计量'
                       class-name="_text"
                       prop="counter"
                       width='180'>
      </el-table-column>
  
      <el-table-column label="品牌"
                       prop="brand">
  
      </el-table-column>
  
      <el-table-column label="型号"
                       prop="model">
  
      </el-table-column>
  
      <el-table-column label="材质">
        <template scope="scope">
          {{scope.row.quotaAuxiliaryMaterial.name}}
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="更换辅材"
               :visible.sync="visible">
  
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    update () {

    },
    handleEditCounter (counterId) {
      this.openDialog()
    },
    openDialog () {
      this.visible = true

    },
    closeDialog () {
      this.visible = false
    }
  }
}
</script>

