<template>
  <div v-if='data.diff.fields[prop]'>
    <p class="info-cell">
      <span class="_text">[修改后]:</span>{{transformFn(data[prop])}}
    </p>
    <p>
      <span class="_text">[修改前]:</span>{{transformFn(data.diff.prevRow[prop])}}
    </p>
  </div>
  <div v-else>
    {{data[prop]}}
  </div>
</template>
<script>
export default {
  name: 'DiffCell',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    prop: {
      type: String,
      default: ''
    },
    transformFn: {
      type: Function,
      default: val => val
    }
  }
}
</script>
