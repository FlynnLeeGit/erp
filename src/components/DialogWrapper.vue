<template>
  <el-dialog :title="modeMap[mode].title"
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

