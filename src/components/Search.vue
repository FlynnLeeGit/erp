<template>
  <el-input @input='syncValue'
            style="width:180px"
            :icon='loadingIcon'
            :force-render='filterTable'
            placeholder='全表搜索'>
  </el-input>
</template>
<script>
export default {
  name: 'Search',
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
    },
    map: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      loadingIcon: '',
      last: null
    }
  },
  methods: {
    // debounce value
    syncValue (newVal) {
      clearTimeout(this.last)
      this.loadingIcon = 'loading'
      this.last = setTimeout(() => {
        this.loadingIcon = ''
        this.$emit('input', newVal)
      }, 300)
    }
  },
  computed: {
    filterTable () {
      const _res = this.$utils.search(this.tableData, this.value, this.fields, this.map)
      this.$emit('update:filterTableData', _res)
      return _res
    }
  }
}
</script>

