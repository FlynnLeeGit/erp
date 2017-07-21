<template>
  <div>
    <button @click="add">ADD</button>
    <ul>
      <li v-for="l in list"
          :key="l.id">
        <router-link :to="link(l.id)"
                     v-text="l.name"></router-link>
  
      </li>
  
    </ul>
  </div>
</template>
<script>
let id = 4
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
      return `/tests/${id}/budget`
    },
    add () {
      id++
      this.list.push({
        id: id,
        name: `项目${id}`
      })
    }
  }
}
</script>

