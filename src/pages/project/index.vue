<template>
  <div>
    <router-view>
    </router-view>
  </div>
</template>
<script>
export default {
  computed: {
    projectBread () {

      return this.$route.matched.shift(0)
    }
  }
}
</script>

