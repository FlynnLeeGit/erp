<template>
  <el-dialog :visible.sync="visible">
    <slot>
    </slot>
    <div slot='footer'
         class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button :type="modeMap[mode].type"
                 :loading='loading'
                 @click="submit(row)">
        {{modeMap[mode].text}}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'DialogWrap',
  props: {
    mode: {
      type: String,
      default: 'add'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      modeMap: {
        add: {
          type: 'success',
          text: '添 加'
        },
        edit: {
          type: 'primary',
          text: '更 新'
        }
      }
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    close () {
      this.visible = false
    },
    submit () {
      this.$emit('submit')
    }
  },
  mounted () {
    document.addEventListener('keyup', e => {
      e.stopPropagation()
      if (e.which === 13) {
        if (this.visible && !this.loading) {
          this.submit()
        }
      }
    })
  }
}
</script>

