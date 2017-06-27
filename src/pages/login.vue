<template>
  <div class="login">
    <el-form :model="loginForm"
             :rules="rules"
             ref="loginForm"
             label-width="100px">
      <el-form-item label="用户名"
                    prop="username">
        <el-input auto-complete='on'
                  v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码"
                    prop="password">
        <el-input type='password'
                  v-model="loginForm.password"></el-input>
      </el-form-item>
  
      <el-form-item>
        <el-button :loading='isSubmiting'
                   type="primary"
                   @click="submitForm('loginForm')">登陆</el-button>
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      },
      isSubmiting: false
    }
  },
  methods: {
    ...mapActions(['login']),
    submitForm (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.isSubmiting = true
          this['login'](this.loginForm)
            .then(() => {
              this.$message.success('登陆成功！')
              this.isSubmiting = false
              const redirectUrl = this.$route.query.redirect
              if (redirectUrl) {
                this.$router.push(redirectUrl)
              } else {
                this.$router.push('/')
              }
            })
            .catch(() => {
              this.isSubmiting = false
            })
        }
      })
    },
    resetForm (form) {
      this.$refs[form].resetFields()
    }
  }
}
</script>

<style lang="scss">
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

