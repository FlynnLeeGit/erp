<template>
  <div class="CardPlus"
       @click="$emit('click')">
    <i class="el-icon-plus"></i>
  </div>
</template>
<script>
export default {
  name: 'CardPlus'
}
</script>

<style lang="scss">
.CardPlus {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8492a6;
  border: 1px dashed #ddd;
  border-radius: 5px;
  font-size: 30px;
  &:hover {
    cursor: pointer;
    color: #58B7FF;
  }
}
</style>

