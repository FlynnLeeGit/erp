<template>
  <div>
    <ul>
      <li v-for="l in list"
          :key="l.id">
        <router-link :to="link(l.id)" v-text="l.name"></router-link>
  
      </li>
    </ul>
  
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [
        { id: '1', name: '项目1' },
        { id: '2', name: '项目2' },
        { id: '3', name: '项目3' },
        { id: '4', name: '项目4' },
      ]
    }
  },
  methods: {
    link (id) {
      return `/tests/${id}`
    }
  }
}
</script>

