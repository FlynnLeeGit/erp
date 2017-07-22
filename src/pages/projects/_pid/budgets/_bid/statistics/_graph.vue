<template>
  <div style="width:600px;height:400px;">
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'

import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'

import macaronsTheme from './macarons.json'
echarts.registerTheme('macarons', macaronsTheme)

const GRAPH_MAP = {
  totalArtificialCost: '人工成本',
  totalAuxiliaryMaterialCost: '辅材成本',
  totalLabourArtificialProfit: '劳方利润',
  totalCompanyProfit: '公司利润'
}
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    space: {
      type: String,
      default: '全部'
    }
  },
  data () {
    return {
      chart: null,
      chartOption: {
        title: {
          text: `[${this.space}]空间数据统计`,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c}元 ({d}%)"
        },
        legend: {
          orient: 'vertical',
          y: 'center',
          left: '70%',
          data: []

        },
        series: [
          {
            name: '成本',
            type: 'pie',
            center: ['40%', '50%'],
            radius: ['45%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    this.chart = echarts.init(this.$el, 'macarons')
    this.chart.setOption(this.chartOption)
  },
  methods: {
    updateData (legendDataMap, seriesData, total) {
      this.chart.setOption({
        title: {
          subtext: `总计 ${total}元`,
        },
        legend: {
          data: ['人工成本', '辅材成本', '劳方利润', '公司利润'],
          formatter (name) {
            return `${name} ${legendDataMap[name]}元`
          }
        },
        series: [{ data: seriesData }]
      })
    }
  },
  watch: {
    data (newGraph) {
      const legendDataMap = {}
      const seriesData = []
      Object.keys(newGraph).forEach(k => {
        if (k !== 'totalPrice') {
          seriesData.push({ value: newGraph[k], name: GRAPH_MAP[k], id: k })
          legendDataMap[GRAPH_MAP[k]] = newGraph[k].toFixed(2)
        }
      })

      this.updateData(legendDataMap, seriesData, newGraph.totalPrice)
    },
    space (newSpace) {
      this.chart.setOption({
        title: {
          text: `[${this.space}]空间数据统计`
        }
      })
    }
  }
}
</script>

