<template>
  <div>
    <ul>
      <li v-for="b in list"
          :key="b.id">
        <router-link :to="link(b.id)">{{b.name}}</router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [
        { id: 1, name: '预算1' },
        { id: 2, name: '预算2' },
        { id: 3, name: '预算3' },
        { id: 4, name: '预算4' },
        { id: 5, name: '预算5' },
      ]
    }
  },
  computed: {
    pid () {
      return this.$route.params.pid
    }
  },
  methods: {
    link (bid) {
      return `/tests/${this.pid}/budget/${bid}/items`
    }
  }
}
</script>

