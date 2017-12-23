const db = require('../../config/db') // 引入user的表结构
const userModel = '../schema/user.js'
const ATMDb = db.ATM // 引入数据库

const User = ATMDb.import(userModel) // 用sequelize的import方法引入表结构，实例化了User。

const getUserById = async function (id) { 
  const userInfo = await User.findOne({
    where: {
      card_id: id
    }
  })
  return userInfo // 返回数据
}

const changeBalance = async function (id, newbalance){  // 获取某个用户的全部todolist
  const balance = await User.update(
    {
      balance: newbalance
    },
    {
      where: {
        card_id: id
      }
    }
  )
  return balance // 返回数据
}

const getBalance = async function (id){  // 获取某个用户的全部todolist
  const balance = await User.findOne(
    {
      where: {
        card_id: id
      },
      attributes: ['balance']
    }
    
  )
  return balance
}

const newPassword = async function (id, newPwd){  // 获取某个用户的全部todolist
  const balance = await User.update(
    {
      password: newPwd
    },
    {
      where: {
        card_id: id
      }
    }
  )
  return result[0] === 1
}


module.exports = {
  getUserById, // 导出getUserById的方法，将会在controller里调用
  getBalance,
  changeBalance,
  newPassword
}