<template>
  <el-form label-position="top"
           label-width="80px"
           class="pwd-form"
           :model="form">
    <el-form-item label="新密码">
      <el-input placeholder='请输入新密码'
                v-model="form.password">
  
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 :loading="isSubmiting"
                 @click="submitForm()">
        确认
      </el-button>
  
    </el-form-item>
  </el-form>
</template>

<script>
import { editPwd } from './api'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      form: {
        password: ''
      },
      isSubmiting: false
    }
  },
  methods: {
    ...mapActions(['logout']),
    submitForm () {
      console.log(this.user)
      this.isSubmiting = true
      editPwd(this.user.id, this.form)
        .then(() => {
          this.$message.success('修改密码成功！将跳转至登陆页...')
          setTimeout(() => {
            this.logout()
          }, 200)
        }).finally(() => {
          this.isSubmiting = false
        })
    }
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>
<style lang="scss">
.pwd-form {
  width: 440px;
}
</style>
