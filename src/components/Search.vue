<template>
  <el-input @input='syncValue'
            style="width:180px"
            :icon='loadingIcon'
            placeholder='全表搜索'>
  </el-input>
</template>
<script>
import { search } from '@/plugins/utils'
let last
export default {
  props: {
    value: {
      type: String,
      default: '',
      required: true
    },
    tableData: {
      type: Array,
      default: () => [],
      required: true
    },
    fields: {
      type: Array,
      default: () => [],
      required: true
    },
    filterTableData: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data () {
    return {
      loadingIcon: ''
    }
  },
  methods: {
    syncValue (newVal) {
      clearTimeout(last)
      this.loadingIcon = 'loading'
      last = setTimeout(() => {
        this.loadingIcon = ''
        this.$emit('input', newVal)
      }, 300)
    }
  },
  computed: {
    filterTable () {
      return search(this.tableData, this.value, this.fields)
    }
  },
  watch: {
    filterTable (newVal) {
      this.$emit('update:filterTableData', newVal)
    }
  }
}
</script>

