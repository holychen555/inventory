const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const financeService = require('../../service/finance/index')
// 收款单据列表
router.get('/collectings/list',function(req,res,next){
    financeService.listCollectings(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取收款单据列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

// 付款单据列表
router.get('/payments/list',function(req,res,next){
    financeService.listPayments(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取付款单据列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

module.exports = router;
