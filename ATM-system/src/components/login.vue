<template>
  <el-row class="content">
    <div id="welcome">
      <img src="../assets/timg.jpeg"> 
    </div>
    <el-col :xs="24" :sm="{span: 6,offset: 9}">
      <span class="title">
       欢迎使用ATM
      </span>
      <el-row>
        <el-input
          v-model="account"
          placeholder="银行卡卡号"
          type="text">
        </el-input>
        <el-input
          v-model="password"
          placeholder="密码"
          type="password"
          @keyup.enter.native="loginToDo">
        </el-input>
        <el-button type="primary" @click="loginToDo">登录</el-button>
      </el-row>
    </el-col>
    <el-col class="hinthere">
      <div id="hint1">
      <p><el-tag type="danger">请插入银行卡</el-tag></p>
    </div>
    </el-col>
    <el-col class="hinthere">
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      account: '',
      password: '',
    }
  },
  methods: {
    loginToDo () {
      let obj = {
        id: this.account,
        password: this.password
      }
      const result = this.$http.post('/auth/user', obj) // 将信息发送给后端
      result.then((res) => {
        if (res.data.success) { // 如果成功
          sessionStorage.setItem('ATM-token', res.data.token) // 用sessionStorage把token存下来
          this.$message({ // 登录成功，显示提示语
            type: 'success',
            message: '登录成功！'
          })
          this.$router.push('/main') // 进入todolist页面，登录成功
        } else {
          this.$message.error(res.data.info) // 登录失败，显示提示语
          sessionStorage.setItem('ATM-token', null) // 将token清空
        }
      }, (err) => {
        console.log(err)
        this.$message.error('请求错误！')
        sessionStorage.setItem('ATM-token', null) // 将token清空
      })
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-row.content
    padding 16px
  .title
    font-size 28px
  .el-input
    margin 12px 0
  .el-button
    width 100%
    margin-top 12px
    background #F56C6C
</style>