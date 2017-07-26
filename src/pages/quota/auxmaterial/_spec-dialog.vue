<template>
  <el-dialog :visible.sync="visible"
             title="添加规格">
    <el-form :model='row'
             label-width='120px'>
      <el-form-item label='名称'
                    prop='name'>
        <el-input placeholder='请输入规格名称'
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
    <div slot='footer'
         class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button v-if="opt==='add'"
                 type="success"
                 :loading='$isAjax.create_spec'
                 @click="submitAdd(row)">
        添 加
      </el-button>
      <el-button v-if="opt==='edit'"
                 type="primary"
                 @click="submitUpdate(row)"
                 :loading="$isAjax.update_spec">
        更 新
      </el-button>
    </div>
  </el-dialog>
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

