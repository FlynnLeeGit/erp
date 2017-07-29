<template>
  <el-dialog :title="modeMap[mode].title"
             :size='size'
             :before-close='close'
             :visible="visible">
    <slot>
    </slot>
    <div slot='footer'
         class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button :type="modeMap[mode].type"
                 :loading='loading'
                 @click="submit()">
        {{modeMap[mode].text}}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'DialogWrapper',
  props: {
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    },
    value: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (newVal) {
      this.visible = newVal
      if (this.visible) {
        this.$nextTick(() => {
          this.setFormNode()
        })
      }
    }
  },
  data () {
    return {
      visible: false,
      form: null
    }
  },
  computed: {
    modeMap () {
      return {
        '': {
          type: 'info',
          text: '确 认',
          title: this.title
        },
        add: {
          type: 'success',
          text: '添 加',
          title: `添加${this.title}`
        },
        edit: {
          type: 'primary',
          text: '更 新',
          title: `更新${this.title}`
        }
      }
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    submit () {
      if (this.form) {
        this.form.validate(valid => {
          if (valid) {
            this.$emit('submit')
          } else {
            return false
          }
        })
      }
    },
    setFormNode () {
      // 寻找form节点
      this.form = null
      const detectForm = (vnode) => {
        if (vnode.$el.className === 'el-form') {
          this.form = vnode
          return
        }
        if (vnode.$children) {
          vnode.$children.forEach(detectForm)
        }
      }
      detectForm(this)
    }
  },
  mounted () {
    document.addEventListener('keyup', e => {
      e.stopPropagation()
      if (this.visible && !this.loading) {
        // enter key
        if (e.which === 13) {
          this.submit()
        }
        // esc key
        if (e.which === 27) {
          this.close()
        }
      }
    })
  }
}
</script>

