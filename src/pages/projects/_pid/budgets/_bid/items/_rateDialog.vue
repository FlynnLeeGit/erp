<template>
  <el-dialog :visible.sync='visible'
             title="批量修改利润率">
    <el-form label-width='120px'>
      <el-form-item label='人工利润率'>
        <el-input-number :step='0.1'
                         :debounce='800'
                         :min='0'
                         v-model='rate.rateOfArtificialProfit'>
        </el-input-number>
        <span class="_ml1">[步进0.1]</span>
      </el-form-item>
      <el-form-item label='公司利润率'>
        <el-input-number :step='0.1'
                         :debounce='800'
                         :min='0'
                         v-model='rate.rateOfCompanyProfit'>
        </el-input-number>
        <span class="_ml1">[步进0.1]</span>
      </el-form-item>
  
    </el-form>
    <div slot='footer'
         class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="info"
                 :loading='$isAjax.update_rate'
                 @click="submitAdd()">
        确认 更新
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      visible: false,
      // 预算id
      bid: 0,
      rate: {
        rateOfArtificialProfit: 0.1,
        rateOfCompanyProfit: 0.3,
      },
    }
  },
  computed: {
    ...mapGetters('projects/_pid/budgets/_bid/items', ['$isAjax']),
  },
  methods: {
    ...mapActions('projects/_pid/budgets/_bid/items', ['update_rate']),
    submitAdd () {
      this.$confirm('【注意】此项设置将修改所有定额项目的人工利润率及公司利润率，您确定要这么做么')
        .then(() => {
          this.update_rate({
            bid: this.bid,
            data: this.rate
          })
            .then(() => {
              this.$message.success("批量修改利润率成功！")
              this.close()
            })
        })
    },
    open (bid) {
      this.bid = bid
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>

