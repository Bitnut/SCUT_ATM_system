<template>
<div>
  <el-row class="content">
    <el-col :xs="24" :sm="{span: 6,offset: 9}">
      <span class="title">
       欢迎使用ATM存款，请输入存款数额
      </span>
      <h1 v-show="keyWay === '3-1'">Hello!</h1>
      <el-row>
        <el-input
          v-model="deposit"
          placeholder="存款金额"
          @keyup.enter.native="deposit">
        </el-input>
        <el-button type="primary" @click="toDeposit">存款</el-button>
      </el-row>
    </el-col>
  </el-row>
</div>
  
</template>

<script>
export default {
  data () {
    return {
      deposit: '',
      activeIndex: '1',
      count: 0,
    };g
  },
  methods: {
    logout () {
          sessionStorage.setItem('ATM-token', null) // 将token清空
          this.$message({ // 登录成功，显示提示语
            type: 'success',
            message: '退出成功！'
          })
          this.$router.push('/') // 返回登录界面
    },
    toDeposit () {
      let obj = {
        token: sessionStorage.getItem('ATM-token'),
        new: this.deposit
      }
      this.$http.post('/api/deposit', obj)
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '存款成功！'
            })
            this.getTodolist()
          } else {
            this.$message.error('存款失败！')
          }
        }, (err) => {
          this.$message.error('错误！')
          console.log(err)
        })
        this.deposit = ''
        alert(obj.new,obj.token)
    },
    goDeposit () {
      this.$router.push('/deposit')
    },
    handleSelect(key, keyPath) {
        console.log(key, keyPath);
    }

  }
};
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