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
                     @click="handleEditCounter(scope.row.id,scope.row.quotaAuxiliaryMaterial.id)">
            更换
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label='计量'
                       class-name="_text"
                       prop="counter"
                       width='180'>
      </el-table-column>
  
      <el-table-column label="材质"
                       class-name="_text">
        <template scope="scope">
          {{scope.row.quotaAuxiliaryMaterial.name}}
        </template>
      </el-table-column>
      <el-table-column label="规格"
                       class-name="_text">
        <template scope="scope">
          {{scope.row.materialSpec}}
        </template>
      </el-table-column>
      <el-table-column label="品牌"
                       class-name="_text"
                       prop="brand">
      </el-table-column>
  
      <el-table-column label="型号"
                       class-name="_text"
                       prop="model">
      </el-table-column>
      <el-table-column label="参考价格(元)"
                       class-name="_text"
                       prop="referencePrice">
      </el-table-column>
  
    </el-table>
    <el-dialog title="更换辅材"
               :visible.sync="visible">
      <el-form label-width="80px">
  
        <el-form-item label='选择'>
          <el-cascader :options="cascaderOpts"
                       placeholder="级联选择规格与型号"
                       v-model="auxModel">
          </el-cascader>
        </el-form-item>
      </el-form>
  
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="info"
                   :loading='$isAjax.replace_aux'
                   @click="submitChange()">
          确认 更新
        </el-button>
      </div>
  
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    sid: {
      type: Number,
      default: 0
    },
    iid: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      visible: false,

      auxModel: ['', '', '', ''],
      cascaderOpts: [],
      currentCounterId: 0,
      // 当前选中的材质id
      currentAuxId: 0
    }
  },
  computed: {
    ...mapGetters('quota/auxmaterial', ['auxOpts', 'specOpts']),
    ...mapGetters('purchase/material', ['brandOpts', 'modelOpts']),
    ...mapGetters('projects/_pid/budgets/_bid/items', ['$isAjax']),
    bid () {
      return +this.$route.params.bid
    }
  },
  methods: {
    ...mapActions('projects/_pid/budgets/_bid/items', ['replace_aux']),

    handleEditCounter (counterId, auxId) {
      this.auxModel = ['', '', '', '']
      this.currentCounterId = counterId

      this.cascaderOpts = this.$utils.toCascader(
        this.auxOpts.filter(aux => aux.value === auxId),
        this.specOpts,
        this.brandOpts,
        this.modelOpts
      )

      this.openDialog()
    },
    submitChange () {
      const data = {
        quotaAuxiliaryCounter: {
          id: this.currentCounterId,
        },
        purchaseMaterial: {
          id: this.auxModel[3]
        }
      }
      this.replace_aux({
        bid: this.bid,
        sid: this.sid,
        iid: this.iid,
        data
      }).then(() => {
        this.$message.success('更换成功')
        this.closeDialog()
      })

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

