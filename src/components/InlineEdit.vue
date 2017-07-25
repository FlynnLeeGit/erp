<template>
  <div class="InlineEdit"
       @click='edit(data)'
       v-loading='isSubmiting'>
    <template v-if='editMode'>
  
      <!--数字类型绑定-->
      <input class="InlineEdit__input"
             v-if="isNumber"
             v-focus
             placeholder="请输入"
             @blur='submit(editRow)'
             @keyup.enter='submit(editRow)'
             type='number'
             :value='computedValue'
             @input='updateEditRowPropVal'>
      </input>
  
      <!--文本类型绑定-->
      <input class="InlineEdit__input"
             v-if='isText'
             placeholder="请输入"
             v-focus
             @blur='submit(editRow)'
             @keyup.enter='submit(editRow)'
             type='text'
             :value='computedValue'
             @input='updateEditRowPropVal'>
      </input>
  
      <textarea class="InlineEdit__input"
                v-if='isTextarea'
                @click.stop='noOp'
                placeholder="请输入"
                v-focus
                :rows='rows'
                @blur='submit(editRow)'
                :value='computedValue'
                @input='updateEditRowPropVal'>
      </textarea>
  
      <!--select类型绑定 加上@click.stop 防止时间冒泡-->
      <select v-if='isSelect'
              @click.stop='noOp'
              v-focus
              class="InlineEdit__input"
              @keyup.enter='submit(editRow)'
              @blur='submit(editRow)'
              :value='computedValue'
              @input='updateEditRowPropVal'>
        <slot name='options'></slot>
      </select>
    </template>
    <div v-else
         class="_pointer">
      <slot>{{computedValue}}</slot>
    </div>
  </div>
</template>
<script>

export default {
  name: 'InlineEdit',
  props: {
    // 行记录对象
    data: {
      type: Object,
      default: () => ({}),
      required: true
    },
    // 需要编辑的属性
    prop: {
      type: String,
      default: 'counter',
      required: true
    },
    // 行内编辑类型
    type: {
      type: String,
      default: 'number'
    },
    transformFn: {
      type: Function,
      default: val => val
    },
    // promise 函数 指定更新的promise函数
    fn: {
      type: Function,
      default: () => { },
      required: true
    },
    rows: {
      type: Number,
      default: 6
    }
  },
  data () {
    return {
      isSubmiting: false,
      editMode: false,
      editRow: {}
    }
  },
  computed: {
    isNumber () {
      return this.type === 'number'
    },
    isText () {
      return this.type === 'text'
    },
    isSelect () {
      return this.type === 'select'
    },
    isTextarea () {
      return this.type === 'textarea'
    },
    propType () {
      return typeof this.$utils.recursionFieldValue(this.data, this.prop)
    },
    computedValue () {
      return this.transformFn(this.$utils.recursionFieldValue(this.data, this.prop))
    }
  },
  methods: {
    noOp () {

    },
    updateEditRowPropVal ($event) {
      let newVal = $event.target.value
      if (this.propType === 'number') {
        newVal = +newVal
        eval('this.editRow.' + this.prop + '=' + newVal)
      }
      if (this.propType === 'string') {
        eval('this.editRow.' + this.prop + '=\'' + newVal + '\'')
      }

    },

    edit (data) {
      this.editMode = true
      this.editRow = this.$utils.deepCopy(this.data)
      if (this.isTextarea) {
        this.$el.parentNode.style.width = '40%'
      }
    },
    submit (editRow) {
      this.editMode = false
      if (JSON.stringify(editRow) !== JSON.stringify(this.data)) {
        console.log('update...')
        this.isSubmiting = true
        this.$emit('before-update', editRow)
        this.fn(editRow)
          .then(({ data }) => {
            this.$emit('updated', data)
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
  min-height: 18px;
  &__input {
    outline: 0;
    border-radius: 2px;
    padding: 2px;
    width: 100%;
    &:focus {
      border: 1px solid #20a0ff;
    }
  }
  pre {
    line-height: 1.4;
  }
  textarea {
    font-family: monospace;
  }
}
</style>


