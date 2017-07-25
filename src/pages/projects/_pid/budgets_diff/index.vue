<template>
  <div>
    <el-select v-model="prevBid"
               placeholder="请选择">
      <el-option v-for="b in budgetList"
                 :key="b.id"
                 :value="b.id"
                 :label="b.name">
  
      </el-option>
    </el-select>
    相对于
    <el-select v-model="nextBid"
               placeholder="请选择">
      <el-option v-for="b in budgetList"
                 :key="b.id"
                 :value="b.id"
                 :label="b.name">
  
      </el-option>
    </el-select>
    <el-button type="primary"
               @click='diff'>比较</el-button>
    <el-table>
  
    </el-table>
    {{diffTable}}
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import diffTable from '@/plugins/diffTable'
export default {
  data () {
    return {
      prevBid: '',
      nextBid: ''
    }
  },
  created () {
    this.init(this.pid)
  },
  computed: {
    ...mapGetters('projects/_pid/budgets_diff', ['$isAjax', 'prevTable', 'nextTable']),
    ...mapGetters('projects/_pid/spaces', {
      spaces: 'list'
    }),
    ...mapGetters('projects/_pid/budgets', {
      budgetList: 'list'
    }),
    pid () {
      return +this.$route.params.pid
    },
    diffTable () {
      const table = {}
      // this.spaces.forEach(space => {
      //   table[space.id] = diffTable(this.prevTable[space.id] || [], this.nextTable[space.id] || [])
      // })
      return table
    }
  },
  methods: {
    ...mapActions('projects/_pid/budgets_diff', ['init', 'diff_items']),
    diff () {
      this.diff_items({
        prevBid: this.prevBid,
        nextBid: this.nextBid
      })
    }
  },

}
</script>

