<template>
  <div v-loading='$isAjax.init'>
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
               :loading="$isAjax.diff_items"
               @click='diff'>比较</el-button>
    <section>
      <div class="_mt1"
           v-for="space in spaces"
           :key="space.id">
        <h4>[空间] {{space.name}}</h4>
        <el-table :data='diffTableData[space.id]'
                  empty-text="没有该空间差别记录"
                  :row-class-name='rowCls'
                  border>
          <el-table-column label='diff'
                           align='center'
                           width='60'>
            <template scope='scope'>
              <el-tag type='success'
                      v-if="scope.row.diff.status==='add'">
                新增行
              </el-tag>
              <el-tag type='danger'
                      v-if="scope.row.diff.status==='delete'">
                删除行
              </el-tag>
              <el-tag type='primary'
                      v-if="scope.row.diff.status==='change'">
                更新行
              </el-tag>
  
            </template>
          </el-table-column>
          <el-table-column label='#'
                           width="50"
                           prop='id'>
          </el-table-column>
          <el-table-column label='项目名称'
                           show-overflow-tooltip
                           width="120">
            <template scope='scope'>
              {{scope.row.quotaTemplate.name}}
            </template>
          </el-table-column>
          <el-table-column label='计量单位'
                           width="60">
            <template scope='scope'>
              {{scope.row.quotaTemplate.unit}}
            </template>
          </el-table-column>
          <el-table-column label='损耗率'
                           width="60">
            <template scope='scope'>
              {{scope.row.quotaTemplate.wastage}}
            </template>
          </el-table-column>
          <el-table-column label='工程用量'
                           width="100">
            <template scope='scope'>
              <diff-cell :data='scope.row'
                         prop='amount'>
              </diff-cell>
            </template>
          </el-table-column>
          <el-table-column label='劳务利润率'
                           width="80">
            <template scope='scope'>
              <diff-cell :data='scope.row'
                         prop='rateOfArtificialProfit'
                         :transform-fn='val=>`${val*100}%`'>
              </diff-cell>
            </template>
          </el-table-column>
          <el-table-column label='企业利润率'
                           width="80">
            <template scope='scope'>
              <diff-cell :data='scope.row'
                         prop='rateOfCompanyProfit'
                         :transform-fn='val=>`${val*100}%`'>
              </diff-cell>
            </template>
          </el-table-column>
          <el-table-column label='综合单价(元)'
                           align="center">
            <el-table-column label='主材'>
              <template scope='scope'>
                <diff-cell :data='scope.row'
                           prop='openUnitPrincipalMaterialPrice'>
                </diff-cell>
              </template>
            </el-table-column>
            <el-table-column label='辅材'>
              <template scope='scope'>
                <diff-cell :data='scope.row'
                           prop='openUnitAuxiliaryMaterialPrice'>
                </diff-cell>
              </template>
            </el-table-column>
            <el-table-column label='人工'>
              <template scope='scope'>
                <diff-cell :data='scope.row'
                           prop='openUnitArtificialPrice'>
                </diff-cell>
              </template>
            </el-table-column>
  
          </el-table-column>
  
          <el-table-column label='单价'>
            <template scope='scope'>
              <diff-cell :data='scope.row'
                         prop='openUnitTotalPrice'>
              </diff-cell>
            </template>
          </el-table-column>
          <el-table-column label='合计'>
            <template scope='scope'>
              <diff-cell :data='scope.row'
                         prop='openTotalPrice'>
              </diff-cell>
  
            </template>
          </el-table-column>
          <el-table-column label='合计统计数据'
                           align="center">
            <el-table-column label='主材成本'>
              <template scope='scope'>
                <diff-cell :data='scope.row'
                           prop='totalPrincipalMaterialCost'>
                </diff-cell>
              </template>
            </el-table-column>
            <el-table-column label='辅材成本'>
              <template scope='scope'>
                <diff-cell :data='scope.row'
                           prop='totalAuxiliaryMaterialCost'>
                </diff-cell>
              </template>
            </el-table-column>
            <el-table-column label='人工成本'>
              <template scope='scope'>
                <diff-cell :data='scope.row'
                           prop='totalArtificialCost'>
                </diff-cell>
              </template>
            </el-table-column>
            <el-table-column label='劳务利润'>
              <template scope='scope'>
                <diff-cell :data='scope.row'
                           prop='totalLabourArtificialProfit'>
                </diff-cell>
              </template>
            </el-table-column>
            <el-table-column label='公司利润'>
              <template scope='scope'>
                <diff-cell :data='scope.row'
                           prop='totalCompanyTotalProfit'>
                </diff-cell>
              </template>
            </el-table-column>
          </el-table-column>
  
        </el-table>
      </div>
  
    </section>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import diffTable from '@/plugins/diffTable'
export default {
  data () {
    return {
      prevBid: '',
      nextBid: '',
      diffTableData: []
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
    }
  },
  methods: {
    ...mapActions('projects/_pid/budgets_diff', ['init', 'diff_items']),
    updateDiff () {
      const _table = {}
      this.spaces.forEach(space => {
        const prevQuotas = this.prevTable[space.id] ? this.prevTable[space.id].quotas : []
        const nextQuotas = this.nextTable[space.id] ? this.nextTable[space.id].quotas : []
        _table[space.id] = diffTable(prevQuotas, nextQuotas)
      })
      this.diffTableData = _table
    },
    diff () {
      this.diff_items({
        prevBid: this.prevBid,
        nextBid: this.nextBid
      }).then(() => {
        this.updateDiff()

      })
    },
    rowCls (row) {
      if (row.diff.status === 'delete') {
        return 'danger-row'
      }
      if (row.diff.status === 'add') {
        return 'success-row'
      }
    }
  }
}
</script>

