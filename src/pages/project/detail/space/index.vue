<template>
  <div>
    <el-row :gutter="10"
            v-loading='$isAjax.init'>
      <el-col :span='6'
              v-for='(s,index) in list'
              :key='s.id'>
        <card :title='s.name'
              type='default'>
          <p class='_mt1 _text'>
            创建于:{{$utils.toLocaleString(s.createdAt)}}
            <span class="_fr">
              <el-button @click.stop='handleEdit(s)'
                         type='text'
                         class="_p0">
                编辑
              </el-button>
              <el-button @click.stop='handleDelete(s)'
                         :loading='$isAjax.delete && currentDelId === s.id'
                         type='text'
                         class="_p0 _text-danger">
                删除
              </el-button>
            </span>
          </p>
        </card>
      </el-col>
      <el-col :span='6'>
        <card-plus style="height:105px;"
                   @click='handleAdd'>
        </card-plus>
      </el-col>
    </el-row>
  
    <!--dialog-->
    <el-dialog title='空间'
               :visible.sync='showDialog'>
      <el-form :model='row'
               label-width='80px'>
        <el-form-item label='空间'>
          <el-input placeholder='请输入空间名称'
                    v-model='row.name'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer'
           class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button v-if="opt==='add'"
                   type="success"
                   :loading='$isAjax.create'
                   @click="submitAdd(row)">
          添 加
        </el-button>
        <el-button v-if="opt==='edit'"
                   type="primary"
                   :loading='$isAjax.update'
                   @click="submitEdit(row)">
          更 新
        </el-button>
  
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      row: {},
      initialRow: {
        name: ''
      },
      opt: 'add',
      showDialog: false
    }
  },
  created () {
    this.init(this.pid)
  },
  computed: {
    ...mapGetters('project/detail/space', ['list', '$isAjax', 'currentDelId']),
    pid () {
      return +this.$route.params.pid
    }
  },
  methods: {
    ...mapActions('project/detail/space', ['init', 'create', 'update', 'delete']),
    handleAdd () {
      this.opt = 'add'
      this.showDialog = true
      this.row = this.$utils.deepCopy(this.initialRow)
    },
    handleEdit (data) {
      this.opt = 'edit'
      this.showDialog = true
      this.row = this.$utils.deepCopy(data)
    },
    handleDelete (row) {
      this.$confirm('确认删除？')
        .then(() => {
          this.delete({
            pid: this.pid,
            sid: row.id
          }).then(() => {
            this.$message.success('删除成功')
          })
        })
    },
    submitAdd (data) {
      this.create({
        pid: this.pid,
        data
      }).then(() => {
        this.$message.success('添加成功！')
        this.closeDialog()
      })
    },
    submitEdit (data) {
      this.update(data).then(() => {
        this.$message.success('更新成功！')
        this.closeDialog()
      })
    },
    closeDialog () {
      this.showDialog = false
    }
  }
}
</script>



