const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const salesrecordService = require('../../service/sales/salesrecord');
// 销售业绩
router.get('/list',function(req,res,next){
    salesrecordService.listSalesRecord(req.query).then((data)=>{
        new Result(data,'获取销售业绩成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

module.exports = router;