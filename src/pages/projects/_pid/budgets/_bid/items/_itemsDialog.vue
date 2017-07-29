<template>
  <dialog-wrapper size="large"
                  v-model="visible"
                  :loading='$isAjax.create'
                  @submit="submitAdd()"
                  mode='add'
                  title="定额（多选）">
    <collect-table v-if="visible"
                   :selection.sync='selectedQuotas'
                   :version='budgetInfo.version'
                   picker-mode>
    </collect-table>
  </dialog-wrapper>
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
      // this.disabledRows = quotasOnSpace.map(q => q.id)
      this.selectedQuotas = []
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>

