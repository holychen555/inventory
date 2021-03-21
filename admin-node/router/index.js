const express = require('express')
const boom = require('boom')
const goodsRouter = require('./base/goods')
const customerRouter = require('./base/customer')
const vendorRouter = require('./base/vendor')
const warehouseRouter = require('./base/warehouse')
const staffRouter = require('./base/staff')
const purchaseRouter = require('./purchase/purchase')
const prepurchaseRouter = require('./purchase/prepurchase')
const prestockinRouter = require('./purchase/prestockin')
const purchasestockinRouter = require('./purchase/purchasestockin')
const purchasereturnRouter = require('./purchase/purchasereturn')
const ordergoodsRouter = require('./ordergoods')
const salesRouter = require('./sales/sales')
const salesstockoutRouter = require('./sales/salesstockout')
const salesreturnRouter = require("./sales/salesreturn")
const salesrecordRouter = require("./sales/salesrecord")
const checkRouter = require('./stock/check')
const warningRouter = require('./stock/warning')
const financeRouter = require('./finance/index')
const reportsRouter = require('./reports/index')
const Result = require('../models/Result')
const { jwtAuth } = require('./jwt')

// 注册路由
const router = express.Router()

router.use(jwtAuth)//所有请求调用前检查token是否过期及路由是否在白名单中

router.get('/', function(req, res) {
  res.send('进销存管理系统')
})

// 通过 userRouter 来处理 /user 路由，对路由处理进行解耦
router.use('/goods', goodsRouter)
router.use('/customer',customerRouter)
router.use('/vendor',vendorRouter)
router.use('/warehouse',warehouseRouter)
router.use('/staff',staffRouter)
router.use('/purchase',purchaseRouter)
router.use('/prepurchase',prepurchaseRouter)
router.use('/purchasereturn',purchasereturnRouter)
router.use('/ordergoods',ordergoodsRouter)
router.use('/prestockin',prestockinRouter)
router.use('/purchasestockin',purchasestockinRouter)
router.use('/sales',salesRouter)
router.use('/salesstockout',salesstockoutRouter)
router.use('/salesreturn',salesreturnRouter)
router.use('/salesrecord',salesrecordRouter)
router.use('/check',checkRouter)
router.use('/warning',warningRouter)
router.use('/finance',financeRouter)
router.use('/reports',reportsRouter)
/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理流程之后
 * 否则，会拦截正常请求
 */
router.use((req, res, next) => {
  next(boom.notFound('接口不存在'))
})

/**
 * 自定义路由异常处理中间件
 * 注意两点：
 * 第一，方法的参数不能减少
 * 第二，方法的必须放在路由最后
 */
router.use((err, req, res, next) => {
  console.log(err);
  if(err.name && err.name === 'UnauthorizedError'){
    const { status=401,message} = err;
    new Result(null,'Token验证失败',{
      error: status,
      errMsg: message
    }).jwtError(res.status(status))
  }
  const msg = (err && err.message) || '系统错误'
  const statusCode = (err.output && err.output.statusCode) || 500;
  const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
  new Result(null,msg,{
    error: statusCode,
    errorMsg
  }).fail(res.status(statusCode))
})

module.exports = router