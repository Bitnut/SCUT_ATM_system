const koaRouter = require('koa-router')
const router = koaRouter()
const user = require('../controller/user')

router.post('/deposit', user.deposit);         // 存款
router.post('/withdraw', user.withdraw);       // 取款
router.post('/transfer', user.transfer);       // 转账
router.post('/balance', user.checkBalance);     // 查询余额
router.post('/changePwd', user.changePwd);     // 更改密码


module.exports = router