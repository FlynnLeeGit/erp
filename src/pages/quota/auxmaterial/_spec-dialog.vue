<template>
  <dialog-wrapper v-model="visible"
                  title="规格"
                  :loading='$isAjax.create_spec'
                  mode='add'
                  @submit='submitAdd(row)'>
    <el-form :model='row'
             label-width='120px'>
      <el-form-item label='名称'
                    prop='name'>
        <el-input placeholder='请输入规格名称'
                  v-if="visible"
                  v-focus
                  v-model='row.name'>
        </el-input>
      </el-form-item>
      <el-form-item label='限制单价'
                    prop='calcStrategy'>
        <el-input-number v-model="row.limitPrice"
                         :debounce="1000"
                         :min="0"
                         :step="1">
  
        </el-input-number>
        <span class="_ml1">元 [步进1]</span>
      </el-form-item>
    </el-form>
  </dialog-wrapper>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      visible: false,
      row: {},
      initialRow: {
        name: '',
        limitPrice: 0
      },
      auxId: 0,
      opt: 'add',
    }
  },
  computed: {
    ...mapGetters('quota/auxmaterial', ['$isAjax'])
  },
  methods: {
    ...mapActions('quota/auxmaterial', ['create_spec', 'update_spec']),
    close () {
      this.visible = false
    },
    open (opt, auxId, data) {
      this.opt = opt
      this.auxId = auxId
      if (this.opt === 'add') {
        this.row = this.$utils.deepCopy(this.initialRow)
      }
      if (this.opt === 'edit') {
        this.row = this.$utils.deepCopy(data)
      }
      this.visible = true
    },
    submitAdd (data) {
      this.create_spec({
        auxId: this.auxId,
        data
      }).then(() => {
        this.$message.success('添加规格成功！')
        this.close()
      })
    },
    submitUpdate (data) {
      this.update_spec({
        auxId: this.auxId,
        data
      }).then(() => {
        this.$message.success('更新成功！')
        this.close()
      })
    }
  }
}
</script>

