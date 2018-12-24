<template>
  <div class="login">
    <!--
      el-form 整个form组件
      :model="form" 必须提供的对象★ 父传子
      label-width="80px" label宽度

      el-form-item:一个表单项
      element-ui中所有的组件在渲染的时候，这个组件名其实就是类名；
    -->
    <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
      <img src="@/assets/avatar.jpg" alt>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 点击登录按钮的时候需要重新校验整个表单 -->
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入axios模块
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      // this.$refs[formName].resetFields()
      this.$refs.form.resetFields()
    },
    // 校验整个表单,(去下面表格中的Form Methods中找)
    login() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false
        // 校验通过，发生ajax请求
        let res = await this.axios({
          url: 'login',
          method: 'post',
          data: this.form
        })
        let {
          data: { token },
          meta: { status, msg }
        } = res
        if (status === 200) {
          this.$message.success('登录成功')
          // 存储token
          localStorage.setItem('token', token)
          // 跳转到home组件
          this.$router.push('/home')
        } else {
          // 登陆失败，提示错误消息 notice里面
          // $message,弹出消息提示框
          this.$message({
            message: msg,
            type: 'error',
            duration: 1000
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 70px 40px 15px;
    border-radius: 10px;
    position: relative;
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -80px;
      border-radius: 50%;
      border: 10px solid #fff;
    }
  }
}
</style>
