<template>
  <el-dialog size="large"
             :visible.sync="visible"
             title="添加定额（多选）">
    <collect-table v-if="visible"
                   :disabled-rows='disabledRows'
                   :selection.sync='selectedQuotas'
                   :version='budgetInfo.version'
                   picker-mode>
    </collect-table>
    <div slot='footer'
         class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="success"
                 :loading='$isAjax.create'
                 @click="submitAdd()">
        确认 添加
      </el-button>
  
    </div>
  </el-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import collectTable from '@/pages/collects/_collectTable.vue'
export default {
  components: {
    collectTable
  },
  data () {
    return {
      visible: false,

      // 预算id
      bid: 0,
      // 空间id
      sid: 0,

      activeName: '',

      // 已经添加过的禁用
      disabledRows: [],

      selectedQuotas: []
    }
  },
  computed: {
    ...mapGetters('projects/_pid/budgets/_bid/items', ['$isAjax']),
    ...mapGetters('projects/_pid/budgets/_bid', ['budgetInfo'])
  },
  methods: {
    ...mapActions('projects/_pid/budgets/_bid/items', ['create']),
    submitAdd () {
      const sendData = {
        [this.sid]: this.selectedQuotas
      }
      this.create({
        bid: this.bid,
        data: sendData
      })
        .then(({ data }) => {
          this.$message.success('添加定额成功')
          this.close()
        })
    },
    open (sid, bid, quotasOnSpace) {
      this.sid = sid
      this.bid = bid
      this.disabledRows = quotasOnSpace.map(q => q.id)
      this.selectedQuotas = []
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>

