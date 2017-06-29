<template>
  <div class="InlineEdit"
       @click='edit(data)'
       v-loading='isSubmiting'>
    <!--数字类型绑定-->
    <input class="InlineEdit__input"
           v-if="editMode && isNumber"
           v-focus
           @blur='submit(editRow)'
           @keyup.enter='submit(editRow)'
           type='number'
           v-model.number='editRow[prop]'>
    </input>
    <!--文本类型绑定-->
    <input class="InlineEdit__input"
           v-else-if='editMode && isText'
           v-focus
           @blur='submit(editRow)'
           @keyup.enter='submit(editRow)'
           type='text'
           v-model='editRow[prop]'>
    </input>
  
    <select v-else-if='editMode && isSelect'
            v-focus
            class="InlineEdit__input"
            @keyup.enter='submit(editRow)'
            @blur='submit(editRow)'
            v-model='editRow[prop]'>
      <slot name='options'>
  
      </slot>
    </select>
  
    <div v-else
         class="_pointer">
      <slot>{{data[prop]}}</slot>
    </div>
  </div>
</template>
<script>
import { deepCopy, replaceObjectFields } from '@/plugins/utils'
export default {
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
    // promise 函数 制定更新的promise函数
    fn: {
      type: Function,
      default: () => { },
      required: true
    },
    // 是否直接更新原始data数据
    directModify: {
      type: Boolean,
      default: false
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
    }
  },
  methods: {
    edit (data) {
      this.editMode = true
      this.editRow = deepCopy(this.data)
    },
    submit (editRow) {
      this.editMode = false
      if (JSON.stringify(editRow) !== JSON.stringify(this.data)) {
        this.isSubmiting = true
        this.$emit('before-update', editRow)
        this.fn(editRow)
          .then(({ data }) => {
            if (this.directModify) {
              replaceObjectFields(this.data, data)
            }
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
}
</style>


