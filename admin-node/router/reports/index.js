const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const reportsService = require('../../service/reports/index')
// 采购明细报表
router.get('/purchasereport/list',function(req,res,next){
    reportsService.listPurchaseReport(req.query).then(({list,count,page,pageSize})=>{
        new Result({list,count,page,pageSize},'获取采购明细列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

// 销售明细报表
router.get('/salesreport/list',function(req,res,next){
    reportsService.listSalesReport(req.query).then(({list,count,page,pageSize})=>{
        new Result({list,count,page,pageSize},'获取销售明细列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

// 利润报表
router.get('/profitreport',function(req,res,next){
    reportsService.getProfitReport(req.query).then(({sales,purchase})=>{
        new Result({sales,purchase},'获取利润列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

module.exports = router