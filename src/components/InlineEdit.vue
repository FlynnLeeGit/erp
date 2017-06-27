<template>
  <div class="InlineEdit"
       v-loading='isSubmiting'>
    <input class="InlineEdit__input"
           v-if='editMode'
           v-focus
           @blur='submit(data)'
           @keyup.enter='submit(data)'
           type='number'
           v-model.number='editRow[prop]'>
    </input>
    <div v-else
         @click='edit(data)'
         class="_pointer">
      {{data[prop]}}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
      required: true
    },
    prop: {
      type: String,
      default: 'counter',
      required: true
    },
    type: {
      type: String,
      default: 'number'
    },
    fn: {
      type: Function,
      default: () => { },
      required: true
    }
  },
  data () {
    return {
      isSubmiting: false,
      editMode: false,
      editRow: {}
    }
  },
  methods: {
    edit (data) {
      this.editMode = true
      this.editRow = Object.assign({}, this.data)
    },
    submit (data) {
      this.editMode = false
      if (JSON.stringify(this.editRow) !== JSON.stringify(this.data)) {
        this.isSubmiting = true
        this.fn(this.editRow)
          .then(({ data }) => {
            this.$emit('success', data)
          })
          .finally(() => {
            this.isSubmiting = false
          })
      }
    }
  }
}
</script>
<style lang='scss'>
.InlineEdit {
  &__input {
    outline: 0;
    border-radius: 2px;
    padding: 2px;
    &:focus {
      border: 1px solid #20a0ff;
    }
  }
}
</style>


