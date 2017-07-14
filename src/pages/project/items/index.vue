<template>
  <div>
    <div class="title-txt">
      项目:[{{$route.query.pname}}][{{$route.query.bname}}]
    </div>
    <section v-loading='isFetching'>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-button class="_mt1"
                     type="primary"
                     @click='handleOpenRateDialog(bid)'
                     size="large">
            利润率批量修改
          </el-button>
        </el-col>
        <el-col :span='20'>
          <el-alert type='info'
                    v-if="budgetData.totalPrice"
                    title='汇总信息'
                    :description="budgetDesc"
                    show-icon>
          </el-alert>
        </el-col>
  
      </el-row>
      <div class="_mt2"
           v-for='space in spaceList'
           :key='space.id'>
        <h4>
          <el-button @click="openDialog(space.id)"
                     type='success'
                     size='small'>
            添加定额
          </el-button>
          [空间]{{space.name}}
        </h4>
        <el-table class="_mt1"
                  :data='quotaTable(space.id)'
                  empty-text="暂无此空间模版数据"
                  border>
          <el-table-column label="操作"
                           width="80"
                           align="center">
            <template scope="scope">
              <el-button size="mini"
                         :loading='isDeleting && delId===scope.row.id && delSid === space.id'
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
                           :fn='editFn.bind(this,space.id,scope.row.id)'
                           :direct-update='false'
                           @updated='handleUpdateBudget'>
              </inline-edit>
            </template>
          </el-table-column>
          <el-table-column label='劳务利润率[可编辑]'
                           width="80">
            <template scope='scope'>
              <inline-edit type='number'
                           :data='scope.row'
                           prop='rateOfArtificialProfit'
                           :fn='editFn.bind(this,space.id,scope.row.id)'
                           :direct-update='false'
                           @updated='handleUpdateBudget'>
              </inline-edit>
            </template>
          </el-table-column>
          <el-table-column label='企业利润率[可编辑]'
                           width="80">
            <template scope='scope'>
              <inline-edit type='number'
                           :data='scope.row'
                           prop='rateOfCompanyProfit'
                           :fn='editFn.bind(this,space.id,scope.row.id)'
                           :direct-update='false'
                           @updated='handleUpdateBudget'>
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
    <items-dialog ref='dialog'
                  @updated='handleUpdateBudget'>
  
    </items-dialog>
    <rate-dialog ref="rateDialog"
                 @updated='handleUpdateBudget'>
  
    </rate-dialog>
  
  </div>
</template>
<script>
import { get, edit, add, del, getSpaces } from './api'
import itemsDialog from './_itemsDialog.vue'
import rateDialog from './_rateDialog.vue'

export default {
  components: {
    itemsDialog,
    rateDialog
  },
  data () {
    return {
      budgetData: {
        items: {}
      },
      spaceList: [],

      isFetching: false,
      isDeleting: false,
      delSid: 0,
      delId: 0,
    }
  },
  computed: {
    pid () {
      return +this.$route.params.pid
    },
    bid () {
      return +this.$route.params.bid
    },
    budgetDesc () {
      const b = this.budgetData
      return `总售价：${b.totalPrice}元
             公司总利润：${b.totalCompanyProfit}元

             人工售价：${b.totalArtificialPrice}元
             人工成本：${b.totalArtificialCost}元
             人工劳务利润：${b.totalLabourArtificialProfit}元
             人工公司利润：${b.totalCompanyArtificialProfit}元

             辅材售价：${b.totalAuxiliaryMaterialPrice}元
             辅材成本：${b.totalAuxiliaryMaterialCost}元
             辅材公司利润：${b.totalCompanyAuxiliaryMaterialProfit}元
            `
    }
  },
  created () {
    this.initData()
  },

  methods: {
    initData () {
      this.isFetching = true
      Promise.all([get(this.bid), getSpaces(this.pid)])
        .then(([one, two]) => {
          if (one.data) {
            this.budgetData = one.data
          }
          this.spaceList = two.data
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    quotaTable (sid) {
      return this.budgetData.items[sid] ? this.budgetData.items[sid].quotas : []
    },
    editFn (sid, iid, editRow) {
      return edit(this.bid, sid, iid, editRow)
    },
    handleUpdateBudget (newBudget) {
      this.budgetData = newBudget
    },
    handleDelete (sid, row) {
      this.$confirm('确认取消？')
        .then(() => {
          this.isDeleting = true
          this.delSid = sid
          this.delId = row.id
          return del(this.bid, sid, row.id)
        })
        .then(({ data }) => {
          this.handleUpdateBudget(data)
          this.$message.success('删除定额成功！')
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    openDialog (sid) {
      this.$refs.dialog.open(sid, this.bid, this.quotaTable(sid))
    },
    handleOpenRateDialog (bid) {
      this.$refs.rateDialog.open(bid)
    }

  }
}
</script>

<style lang="scss">
.title-txt {
  position: absolute;
  margin-top: -32px;
  margin-left: 121px;
}
</style>

