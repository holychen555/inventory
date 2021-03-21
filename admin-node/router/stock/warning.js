const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const warningService = require('../../service/stock/warning')

router.get('/list',function(req,res,next){
    warningService.listGoodsStock(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取仓库盘点列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

module.exports = router