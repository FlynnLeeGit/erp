<template>
  <div>
    <el-alert type='info'
              title='汇总信息'
              :description="budgetDesc"
              show-icon>
    </el-alert>
  
    <section v-if="budgetData.totalPrice"
             class="_mt1">
      <el-button type="primary"
                 @click='handleOpenRateDialog(bid)'>
        <i class="fa fa-line-chart"></i> 利润率修改
      </el-button>
      <el-button @click='openPdfDialog(budgetData.totalPrice)'
                 type="primary">
        <i class="fa fa-file-pdf-o"></i> 生成PDF
      </el-button>
    </section>
  
    <section v-loading='$isAjax.init'>
      <div class="_mt1"
           v-for='space in spaceList'
           :key='space.id'>
        <h4>
          <el-button @click="openDialog(space.id)"
                     type='success'
                     size='small'>
            添加定额
          </el-button>
          <span>[空间]{{space.name}}</span>
        </h4>
        <el-table class="_mt1"
                  :data='quotaTable(space.id)'
                  empty-text="暂无此空间模版数据"
                  border
                  default-expand-all>
  
          <el-table-column type="expand">
            <template scope="scope">
              <h4>材料计量</h4>
              <items-expand :table-data='scope.row.quotaTemplate.quotaAuxiliaryCounters'
                            :sid='space.id'
                            :iid='scope.row.id'>
              </items-expand>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="80"
                           align="center">
            <template scope="scope">
              <el-button size="mini"
                         :loading='$isAjax.delete && currentIid===scope.row.id && currentSid === space.id'
                         @click='handleDelete(space.id,scope.row)'
                         type="danger">
                删除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label='#'
                           width="50"
                           prop='id'>
          </el-table-column>
          <el-table-column label='项目名称'
                           show-overflow-tooltip
                           width="120"
                           class-name="_text">
            <template scope='scope'>
              {{scope.row.quotaTemplate.name}}
            </template>
          </el-table-column>
          <el-table-column label='计量单位'
                           width="60"
                           class-name="_text">
            <template scope='scope'>
              {{scope.row.quotaTemplate.unit}}
            </template>
          </el-table-column>
          <el-table-column label='损耗率'
                           width="60"
                           class-name="_text">
            <template scope='scope'>
              {{scope.row.quotaTemplate.wastage}}
            </template>
          </el-table-column>
          <el-table-column label='工程用量[可编辑]'
                           width="60">
            <template scope='scope'>
              <inline-edit type='number'
                           :data='scope.row'
                           prop='amount'
                           :fn='editFn.bind(this,space.id,scope.row.id)'>
              </inline-edit>
            </template>
          </el-table-column>
          <el-table-column label='劳务利润率[可编辑]'
                           width="80">
            <template scope='scope'>
              <inline-edit type='number'
                           :data='scope.row'
                           prop='rateOfArtificialProfit'
                           :transform-fn='val => (val*100).toFixed(2)'
                           @before-update='editRow => editRow.rateOfArtificialProfit /= 100'
                           :fn='editFn.bind(this,space.id,scope.row.id)'>
                {{(scope.row.rateOfArtificialProfit*100).toFixed(2)}}%
              </inline-edit>
            </template>
          </el-table-column>
          <el-table-column label='企业利润率[可编辑]'
                           width="80">
            <template scope='scope'>
              <inline-edit type='number'
                           :data='scope.row'
                           prop='rateOfCompanyProfit'
                           :transform-fn='val => (val*100).toFixed(2)'
                           @before-update='editRow => editRow.rateOfCompanyProfit /= 100'
                           :fn='editFn.bind(this,space.id,scope.row.id)'>
                {{(scope.row.rateOfCompanyProfit*100).toFixed(2)}}%
              </inline-edit>
            </template>
          </el-table-column>
          <el-table-column label='综合单价'
                           align="center">
            <el-table-column label='主材'
                             class-name="_text">
              <template scope='scope'>
                {{scope.row.openUnitPrincipalMaterialPrice}}
              </template>
            </el-table-column>
            <el-table-column label='辅材'
                             class-name="_text">
              <template scope='scope'>
                {{scope.row.openUnitAuxiliaryMaterialPrice}}
              </template>
            </el-table-column>
            <el-table-column label='人工'
                             class-name="_text">
              <template scope='scope'>
                {{scope.row.openUnitArtificialPrice}}
              </template>
            </el-table-column>
  
          </el-table-column>
  
          <el-table-column label='单价'
                           class-name="_text">
            <template scope='scope'>
              {{scope.row.openUnitTotalPrice}}
            </template>
          </el-table-column>
          <el-table-column label='合计'
                           class-name="_text">
            <template scope='scope'>
              {{scope.row.openTotalPrice}}
            </template>
          </el-table-column>
          <el-table-column label='合计统计数据'
                           align="center">
            <el-table-column label='主材成本'
                             class-name="_text">
              <template scope='scope'>
                {{scope.row.totalPrincipalMaterialCost}}
              </template>
            </el-table-column>
            <el-table-column label='辅材成本'
                             class-name="_text">
              <template scope='scope'>
                {{scope.row.totalAuxiliaryMaterialCost}}
              </template>
            </el-table-column>
            <el-table-column label='人工成本'
                             class-name="_text">
              <template scope='scope'>
                {{scope.row.totalArtificialCost}}
              </template>
            </el-table-column>
            <el-table-column label='劳务利润'
                             class-name="_text">
              <template scope='scope'>
                {{scope.row.totalLabourArtificialProfit}}
              </template>
            </el-table-column>
            <el-table-column label='公司利润'
                             class-name="_text">
              <template scope='scope'>
                {{scope.row.totalCompanyTotalProfit}}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </section>
  
    <!-- quota dialog -->
    <items-dialog ref='dialog'></items-dialog>
    <rate-dialog ref="rateDialog"></rate-dialog>
    <pdf-dialog ref='pdfDialog'></pdf-dialog>
  
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
// import { get, edit, add, del, getSpaces, getProjects } from './api'
import itemsDialog from './_itemsDialog.vue'
import rateDialog from './_rateDialog.vue'
import pdfDialog from './_pdfDialog.vue'
import itemsExpand from './_items-expand.vue'

export default {
  components: {
    itemsDialog,
    rateDialog,
    pdfDialog,
    itemsExpand
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('projects/_pid/budgets/_bid/items', ['$isAjax', 'budgetData', 'currentSid', 'currentIid']),
    ...mapGetters('projects/_pid/spaces', {
      spaceList: 'list'
    }),
    pid () {
      return +this.$route.params.pid
    },
    bid () {
      return +this.$route.params.bid
    },
    budgetDesc () {
      const b = this.budgetData
      return `总售价：${b.totalPrice || 0}元
             公司总利润：${b.totalCompanyProfit || 0}元

             人工售价：${b.totalArtificialPrice || 0}元
             人工成本：${b.totalArtificialCost || 0}元
             人工劳务利润：${b.totalLabourArtificialProfit || 0}元
             人工公司利润：${b.totalCompanyArtificialProfit || 0}元

             辅材售价：${b.totalAuxiliaryMaterialPrice || 0}元
             辅材成本：${b.totalAuxiliaryMaterialCost || 0}元
             辅材公司利润：${b.totalCompanyAuxiliaryMaterialProfit || 0}元
            `
    }
  },
  created () {
    this.init({
      pid: this.pid,
      bid: this.bid
    })
  },
  methods: {
    ...mapActions('projects/_pid/budgets/_bid/items', ['init', 'delete', 'update']),
    quotaTable (sid) {
      return this.budgetData.items[sid] ? this.budgetData.items[sid].quotas : []
    },
    editFn (sid, iid, editRow) {
      return this.update({
        bid: this.bid,
        sid,
        iid,
        data: editRow
      })
    },
    handleDelete (sid, row) {
      this.$confirm('确认取消？')
        .then(() => {
          this.delete({
            bid: this.bid,
            sid,
            iid: row.id
          }).then(() => {
            this.$message.success('删除定额成功！')
          })
        })
    },
    openDialog (sid) {
      this.$refs.dialog.open(sid, this.bid, this.quotaTable(sid))
    },
    handleOpenRateDialog (bid) {
      this.$refs.rateDialog.open(bid)
    },
    openPdfDialog (matAndArtTotalPrice) {
      this.$refs.pdfDialog.open(matAndArtTotalPrice)
    }
  }
}
</script>

