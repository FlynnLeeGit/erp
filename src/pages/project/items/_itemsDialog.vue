<template>
  <el-dialog title='添加定额'
             :visible.sync='visible'>
    <el-form ref='form'
             label-width="80px">
      <el-form-item label='定额'>
        <el-cascader v-model='selectedCollect'
                     expand-trigger="hover"
                     :options="collectOptionsCopy"
                     filterable
                     @change='addInList'
                     :show-all-levels="false"
                     placeholder="请选择定额模版">
        </el-cascader>
  
      </el-form-item>
  
      <el-form-item label='已选模版'>
        <el-tag class="_ml1"
                type='primary'
                closable
                @close='closeTag(index,q)'
                v-for='(q,index) in selectedQuotas'
                :key='index'>
          {{collectQuotaMap[q.value]}}
        </el-tag>
      </el-form-item>
    </el-form>
    <div slot='footer'
         class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="success"
                 :loading='isSubmiting'
                 @click="submitAdd()">
        确认
      </el-button>
    </div>
  
  </el-dialog>
</template>
<script>
import { add } from './api'
export default {
  props: {
    collectOptions: {
      type: Array,
      default: () => []
    },
    collectQuotaMap: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      visible: false,

      // 预算id
      bid: 0,
      // 空间id
      sid: 0,

      collectOptionsCopy: [],
      selectedCollect: ['', ''],
      isSubmiting: false,

      selectedQuotas: []
    }
  },
  methods: {
    init () {
      this.collectOptionsCopy = this.$utils.deepCopy(this.collectOptions)
      this.selectedCollect = ['', '']
      this.selectedQuotas = []
    },
    submitAdd () {
      this.isSubmiting = true
      const data = {
        [this.sid]: this.selectedQuotas.map(d => d.value)
      }
      add(this.bid, data).then(({ data }) => {
        console.log(data)
        this.close()
      }).finally(() => {
        this.isSubmiting = false
      })
    },
    addInList (val) {
      const groupIndex = val[0]
      const quotaTemplateId = val[1]
      this.$log(groupIndex, quotaTemplateId)

      const opts = this.collectOptionsCopy[groupIndex].children
      const opt = opts.filter(o => o.value === quotaTemplateId)[0]
      opt.disabled = true
      this.selectedQuotas.push(opt)
    },
    toDisableSelectOption () {

    },
    open (sid, bid) {
      this.sid = sid
      this.bid = bid
      this.init()
      this.visible = true
    },
    close () {
      this.visible = false
    },
    closeTag (index, quotaTemplateId) {
      this.selectedQuotas.splice(index, 1)

    }
  }
}
</script>

