<template>
  <el-dialog size="large"
             :visible.sync="visible"
             title="添加定额（多选）">
    <collect-table v-if='visible'
                   :disabled-rows='disabledRows'
                   :selection.sync='selectedQuotas'
                   picker-mode>
    </collect-table>
    <div slot='footer'
         class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="success"
                 :loading='isSubmiting'
                 @click="submitAdd()">
        确认 添加
      </el-button>
  
    </div>
  
  </el-dialog>
</template>
<script>
import { add } from './api'
import collectTable from '../collect/_collectTable.vue'
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

      // 已经添加过的禁用
      disabledRows: [],

      isSubmiting: false,

      selectedQuotas: []
    }
  },
  methods: {
    submitAdd () {
      this.isSubmiting = true
      const sendData = {
        [this.sid]: this.selectedQuotas
      }
      add(this.bid, sendData)
        .then(({ data }) => {
          this.$emit('updated', data)
          this.$message.success('添加定额成功')

          this.close()
        })
        .finally(() => {
          this.isSubmiting = false
        })

    },
    open (sid, bid, quotasOnSpace) {
      this.sid = sid
      this.bid = bid
      this.disabledRows = quotasOnSpace.map(q => q.id)
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>

