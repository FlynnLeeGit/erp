<template>
  <dialog-wrapper title='人工计量'
                  :loading='$isAjax.create_artficial_count'
                  v-model='visible'
                  mode='add'
                  @submit="submit(row)">
    <el-form :model='row'
             label-width='80px'>
      <el-form-item label='模版ID'>
        <span>{{qRow.id}}</span>
      </el-form-item>
      <el-form-item label='工种'>
        <el-select v-model='row.quotaArtficial.id'>
          <el-option v-for='art in artList'
                     :key='art.id'
                     :value='art.id'
                     :label="art.workType"
                     :disabled="optionDisabled(qRow,art)">
            <span style="float: left">{{ art.workType }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{art.price}}元</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='用量'>
        <el-input-number :debounce='1000'
                         :min='0'
                         v-model='row.counter'
                         :step='0.1'>
        </el-input-number>
        <span class="_ml1">[步进0.1]</span>
      </el-form-item>
    </el-form>
  </dialog-wrapper>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      visible: false,
      row: {
        quotaArtficial: {}
      },
      initialRow: {
        counter: 0,
        quotaArtficial: {
          id: ''
        }
      },

      qRow: {},
    }
  },
  computed: {
    ...mapGetters('quota/artficial', {
      artList: 'list'
    }),
    ...mapGetters('quota/quota', ['$isAjax'])
  },
  methods: {
    ...mapActions('quota/quota', ['create_artficial_count']),
    // 还原row为初始空内容状态
    optionDisabled (qRow, art) {
      return qRow.quotaArtficialCounters && this.$utils.valueInArray(qRow.quotaArtficialCounters, art.id, 'quotaArtficial.id')
    },
    restoreRow (qid) {
      this.row = this.$utils.deepCopy(this.initialRow)
    },
    submit (data) {
      this.create_artficial_count({
        qid: this.qRow.id,
        data
      }).then(() => {
        this.$message.success(`添加人工计量至 ${this.qRow.name} 成功`)
        this.close()
      })
    },
    open (qRow) {
      this.qRow = qRow
      this.restoreRow()
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>

