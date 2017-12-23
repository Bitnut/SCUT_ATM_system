//import { reset } from '../../../../../.cache/typescript/2.6/node_modules/@types/continuation-local-storage';

const user = require('../models/user');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const getUserInfo = async function (ctx){
  const id = ctx.params.id; // 获取url里传过来的参数里的id
  const result = await user.getUserById(id);  // 通过yield “同步”地返回查询结果
  ctx.body = result // 将请求的结果放到response的body里返回
}

const postUserAuth = async function (ctx) {
  const data = ctx.request.body // post过来的数据存在request.body里
  const userInfo = await user.getUserById(data.id)
  if (data.id == "") {
    ctx.body = {
      success: false,
      info: '请输入银行卡账号！' // 如果用户不存在返回用户不存在
    }
    return
  }
  if (userInfo != null) { // 如果查无此用户会返回null
    if (!bcrypt.compareSync(data.password, userInfo.password)) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync("123456", salt);
      console.log(hash)
      ctx.body = {
        success: false, // success标志位是方便前端判断返回是正确与否
        info: '密码错误！'
      }
    } else {
      const userToken = {
        id: userInfo.card_id
      }
      const secret = 'ATM-token' // 指定密钥
      const token = jwt.sign(userToken, secret) // 签发token
      ctx.body = {
        success: true,
        token: token // 返回token
      }
    }
  } else {
    ctx.body = {
      success: false,
      info: '用户不存在！' // 如果用户不存在返回用户不存在
    }
  }
}

const deposit = async function (ctx){
  const data = ctx.request.body
  const token = data.token
  const getToken = jwt.verify(token, 'ATM-token')
  const id = getToken.id
  const newMoney = data.new
  if (newMoney>0){
    var real = to_100(newMoney)
    const Balance = await user.getBalance(id) // 通过yield “同步”地返回查询结果
    var newbalance = Balance.balance + parseInt(real)
    const result = await user.changeBalance(id,newbalance)
    ctx.body = {
      success: true,
      info: '存款成功！' // 如果用户不存在返回用户不存在
    }
  } else {
    ctx.body = {
      success: false,
      info: '输入为负数不符合规范！' // 如果用户不存在返回用户不存在
    }
  }
  
}

const withdraw = async function (ctx){
  const data = ctx.request.body
  const token = data.token
  const getToken = jwt.verify(token, 'ATM-token')
  const id = getToken.id
  const withdraw_amount = data.take
  const Savings = await user.getBalance(id)
  if (withdraw_amount>0){
    if (Savings.balance < withdraw_amount) {
      ctx.body = {
        success: false,
        info: '余额不足！'
      }
    } else {
      var real = to_100(withdraw_amount)
      var newSavings = Savings.balance - parseInt(real)
      user.changeBalance(id, newSavings)
      ctx.body = {
        success: true,
        info: '取款成功！' // 如果用户不存在返回用户不存在
      }
    }
  } else {
    ctx.body = {
      success: false,
      info: '输入为负数不符合规范！' // 如果用户不存在返回用户不存在
    }
  }
    
}

const checkBalance = async function (ctx){
  const data = ctx.request.body
  const token = data.token
  const getToken = jwt.verify(token, 'ATM-token')
  const id = getToken.id
  const result = await user.getBalance(id) // 通过yield “同步”地返回查询结果
  ctx.body = {
    success: true,
    balance: result.balance,
    info: '查询成功！'
  }
}

const transfer = async function (ctx){
  const data = ctx.request.body
  const token = data.token
  const getToken = jwt.verify(token, 'ATM-token')
  const from_id = getToken.id
  const to_id = data.to
  var toexist = await user.getUserById(to_id)
  if (toexist != null){
    const fromSavings = await user.getBalance(from_id)
    const toSavings = await user.getBalance(to_id)
    const transfer_amount = data.transfer
    var real = to_100(transfer_amount)
    if (fromSavings.balance < real) {
      ctx.body = {
        success: false,
        info: '余额不足！' // 如果用户不存在返回用户不存在
      }
    } else {  
      var to_new = toSavings.balance + real
      var from_new = fromSavings.balance - real
      user.changeBalance(to_id, to_new)
      user.changeBalance(from_id, from_new)
      ctx.body = {
        success: true,
        info: '转账成功！' // 如果用户不存在返回用户不存在
      }
    }
  } else {
    ctx.body = {
      success: false,
      info: '银行卡号错误！' // 如果用户不存在返回用户不存在
    }
    return
  }
}

const changePwd = async function (ctx) {
  const data = ctx.request.body
  const token = data.token
  const getToken = jwt.verify(token, 'ATM-token')
  const id = getToken.id
  const userInfo = await user.getUserById(id)
  const newPwd = data.newpwd
  const confirmPwd = data.confirmpwd
  if (bcrypt.compareSync(data.password, userInfo.password)) {
    if (newPwd === confirmPwd) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(newPwd, salt);
      console.log(hash)
      user.newPassword(userInfo.id,hash)
      ctx.body = {
        success: true, 
        info: '密码更新成功！'
      }
    } else {
      ctx.body = {
        success: false,
        info: '两次输入密码不一致！'
      }
    }
  } else {
    ctx.body = {
      success: false,
      info: '密码错误！'
    }
  }
}

const to_100 = function (num) {
    var result = num/100
    console.log(result)
    result = parseInt(result)
    var newMoney = result*100
    return newMoney
}


module.exports = {
  getUserInfo, // 把获取用户信息的方法暴露出去 
  postUserAuth,
  deposit,
  withdraw,
  transfer,
  checkBalance,
  changePwd
}