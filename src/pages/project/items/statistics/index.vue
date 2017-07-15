<template>
  <div v-loading='isFetching'>
  
    <section style="width:600px;"
             class="_ml2">
      <span>空间选择</span>
      <el-select v-model="selectedSpace"
                 @change="getStatisticBySpace">
        <el-option v-for='space in spaceOpts'
                   :key="space.id"
                   :value="space.id"
                   :label="space.name">
        </el-option>
      </el-select>
    </section>
  
    <section class="_mt2">
      <graph :data='statistic.graph'
             :space='spaceMap[selectedSpace]'>
      </graph>
    </section>
  
    <!-- 人工汇总数据 -->
    <section>
      <h3>人工成本统计</h3>
      <el-table :data="statistic.artificial.workers"
                class="_mt1"
                border
                style="width:70%">
        <el-table-column label="工种"
                         prop="workType">
        </el-table-column>
        <el-table-column label="单价"
                         prop="unitPrice">
  
        </el-table-column>
        <el-table-column label="工作量(天)"
                         prop="totalAmount">
  
        </el-table-column>
        <el-table-column label="人工成本合计"
                         prop="totalPrice">
  
        </el-table-column>
        <el-table-column label="劳方合计(含劳方利润)"
                         prop="totalLabourPrice">
        </el-table-column>
      </el-table>
    </section>
  
    <section class="_mt4">
      <h3>辅材成本统计</h3>
      <div class="_mt1"
           v-for="(specList,specName) in statistic.auxiliary.specs"
           :key='specName'>
        <h5>{{specName}}</h5>
        <el-table style="width:70%"
                  border
                  :data="specList">
          <el-table-column label="品牌"
                           prop="brand">
          </el-table-column>
          <el-table-column label="单位"
                           prop="unit">
  
          </el-table-column>
          <el-table-column label="单位价格"
                           prop="unitPrice">
  
          </el-table-column>
          <el-table-column label="用量"
                           prop="amount">
  
          </el-table-column>
          <el-table-column label="合计价格"
                           prop="totalPrice">
          </el-table-column>
        </el-table>
      </div>
  
    </section>
  </div>
</template>
<script>
import { get, getBySpace, getSpaces } from './api'
import graph from './_graph.vue'

export default {
  components: {
    graph
  },
  data () {
    return {
      statistic: {
        artificial: {
          workers: []
        },
        auxiliary: {
          specs: {}
        }
      },
      spaceList: [],
      selectedSpace: 0,

      isFetching: false
    }
  },
  computed: {
    pid () {
      return +this.$route.params.pid
    },
    bid () {
      return +this.$route.params.bid
    },
    spaceOpts () {
      const opts = this.spaceList.slice()
      opts.unshift({ name: '全部', id: 0 })
      return opts
    },
    spaceMap () {
      return this.$utils.listToMap(this.spaceOpts)
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
          this.statistic = one.data
          this.spaceList = two.data
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    getStatisticBySpace (sid) {
      this.isFetching = true
      getBySpace(this.bid, sid)
        .then(({ data }) => {
          this.statistic = data
        })
        .finally(() => {
          this.isFetching = false
        })

    }
  }
}
</script>

