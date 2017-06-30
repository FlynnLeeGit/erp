<template>
  <el-input @input='syncValue'
            style="width:180px"
            :icon='loadingIcon'
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
      return this.$utils.search(this.tableData, this.value, this.fields, this.map)
    }
  },
  watch: {
    filterTable (newVal) {
      this.$emit('update:filterTableData', newVal)
    }
  }
}
</script>

