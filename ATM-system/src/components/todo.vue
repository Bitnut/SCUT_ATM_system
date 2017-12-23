<template>
  <div class="diactive">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          >
          <el-menu-item index="1">修改密码</el-menu-item>
          <el-menu-item index="2" @click="getSave" >查询余额</el-menu-item>
          <el-submenu index="3">
            <template slot="title">办理业务</template>
            <el-menu-item index="3-1" >存款</el-menu-item>
            <el-menu-item index="3-2" >取款</el-menu-item>
            <el-menu-item index="3-3" >转账</el-menu-item>
          </el-submenu>
          <el-menu-item index="4" @click="logout">退出登录</el-menu-item>
        </el-menu>
        <div v-if="keyWay === null">
          <img src="../assets/gongshang.png">
          <el-carousel :interval="4000" type="card" height="300px">
            <el-carousel-item class="index" v-for="(item, index) in arr" :key="index">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </div>
         

        <div v-if="keyWay === '3-1'">
          <el-row class="content">
            <el-col :xs="24" :sm="{span: 6,offset: 9}">
              <span class="title">
              欢迎使用ATM存款，请输入存款数额
              </span>
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
        <div v-if="keyWay === '3-2'">
          <el-row class="content">
            <el-col :xs="24" :sm="{span: 6,offset: 9}">
              <span class="title">
              欢迎使用ATM取款，请输入取款数额
              </span>
              <el-row>
                <el-input
                  v-model="withdraw"
                  placeholder="取款金额"
                  @keyup.enter.native="withdraw">
                </el-input>
                <el-button type="primary" @click="toWithdraw">取款</el-button>
              </el-row>
            </el-col>
          </el-row>
        </div>

        <div v-if="keyWay === '3-3'">
          <el-row class="content">
            <el-col :xs="24" :sm="{span: 6,offset: 9}">
              <span class="title">
              欢迎使用ATM转账，请输入转账数额
              </span>
              <el-row>
                <el-input
                  v-model="to_id"
                  placeholder="请输入对方银行卡卡号"
                  @keyup.enter.native="to_id">
                </el-input>
                <el-input
                  v-model="transfer"
                  placeholder="转账金额"
                  @keyup.enter.native="transfer">
                </el-input>
                <el-button type="primary" @click="toTransfer">转账</el-button>
              </el-row>
            </el-col>
          </el-row>
        </div>

        <div v-if="keyPart === '1'">
          <el-row class="content">
            <el-col :xs="24" :sm="{span: 6,offset: 9}">
              <span class="title">
              修改银行卡密码！
              </span>
              <el-row>
                <el-input
                  v-model="oldpw"
                  placeholder="请输入旧密码"
                  @keyup.enter.native="oldpw">
                </el-input>
                <el-input
                  v-model="newpw"
                  placeholder="请输入新密码"
                  @keyup.enter.native="newpw">
                </el-input>
                <el-input
                  v-model="confirmpw"
                  placeholder="请再次确认密码"
                  @keyup.enter.native="confirmpw">
                </el-input>
                <el-button type="primary" @click="toChange">更改密码</el-button>
              </el-row>
            </el-col>
          </el-row>
        </div>


        <div v-if="keyPart === '2'">
          <el-row class="content">
            <el-col :xs="24" :sm="{span: 6,offset: 9}">
              <span class="title">
              您的余额为：{{save}} 
              </span>
              <el-row>
              </el-row>
            </el-col>
          </el-row>
        </div>
  </div>
</template>

<script>
import Img1 from "../assets/gift.png"
import Img2 from "../assets/cardasset.png"
import Img3 from "../assets/ebank.png"
export default {
  data () {
    return {
      activeIndex: '1',
      activeName: 'first',
      deposit: '',
      count: 0,
      keyWay: null,
      keyPart: null,
      withdraw: '',
      transfer: '',
      to_id: '',
      oldpw: '',
      newpw: '',
      confirmpw: '',
      save: '',
      arr: [
        { imgUrl: Img1 },
        { imgUrl: Img2 },
        { imgUrl: Img3 },
      ]
    };g
  },
  methods: {
    handleSelect(key, keyPath) {
        console.log(key, keyPath)
        this.keyWay = keyPath[1]
        this.keyPart = keyPath[0]
    },
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
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '存款成功！'
            })
          } else {
            this.$message.error('存款失败,'+res.data.info)
          }
        }, (err) => {
          this.$message.error('错误！')
          console.log(err)
        })
        this.deposit = ''
    },
    toWithdraw () {
      let obj = {
        token: sessionStorage.getItem('ATM-token'),
        take: this.withdraw
      }
      this.$http.post('/api/withdraw', obj)
        .then((res) => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '取款成功！'
            })
          } else {
            alert(res.data.info)
            this.$message.error('取款失败,'+ res.data.info)
          }
        }, (err) => {
          this.$message.error('错误！')
          console.log(err)
        })
        this.withdraw = ''
    },
    toTransfer () {
      let obj = {
        token: sessionStorage.getItem('ATM-token'),
        transfer: this.transfer,
        to: this.to_id
      }
      this.$http.post('/api/transfer', obj)
        .then((res) => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '转账成功！'
            })
          } else {
            this.$message.error('转账失败,'+res.data.info)
          }
        }, (err) => {
          this.$message.error('错误！')
          console.log(err)
        })
        this.transfer = ''
        this.to_id = ''
    },
    toChange () {
      let obj = {
        token: sessionStorage.getItem('ATM-token'),
        newpwd: this.newpw,
        password: this.oldpw,
        confirmpwd: this.confirmpw
      }
      this.$http.post('/api/changePwd', obj)
        .then((res) => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '修改密码成功！'
            })
          } else {
            this.$message.error('修改密码失败,'+ res.data.info)
          }
        }, (err) => {
          this.$message.error('错误！')
          console.log(err)
        })
        this.transfer = ''
        this.to_id = ''
    },
    getSave() {
      let obj = {
        token: sessionStorage.getItem('ATM-token')
      }
      const balance = this.$http.post('/api/balance', obj)
      .then((res) => {
          if (res.data.success) {
            if (balance !== null) {
            this.save = res.data.balance
            } else {
              this.save = ''
            }
          }
        }, (err) => {
          this.$message.error('错误！')
          console.log(err)
        })
    }

  }
};
</script>



<style lang="stylus" scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .todo-list
    width 100%
    margin-top 8px
    padding-bottom 8px
    border-bottom 1px solid #eee
    overflow hidden
    text-align left
    .item
      font-size 20px
      &.finished
        text-decoration line-through
        color #ddd
  .pull-right
    float right
</style>