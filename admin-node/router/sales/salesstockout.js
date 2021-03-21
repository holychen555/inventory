const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const salesstockoutService = require('../../service/sales/salesstockout')
// 销售出库单
router.get('/salesstockoutid',function(req,res,next){
    salesstockoutService.getSalesStockoutId().then((data)=>{
        new Result(data,'获取销售出库单编号成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/add',
    function (req, res, next) {
        salesstockoutService.addSalesStockout(req).then(() => {
            new Result('添加销售出库单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get('/list',function(req,res,next){
    salesstockoutService.listSalesStockout(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取销售出库单列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const salesId = req.params.id;
    salesstockoutService.getSalesStockoutById(salesId).then((data)=>{
        console.log(data);
        new Result(data,'获取销售出库单信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/approval',
    function (req, res, next) {
        salesstockoutService.updateSalesStockoutApproval(req).then(() => {
            new Result('修改销售出库单审核状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/delete/:id',
    function (req, res, next) {
        const id = req.params.id;
        salesstockoutService.deleteSalesStockout(id).then(() => {
            new Result('删除销售出库单成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        salesstockoutService.updateSalesStockout(req.query).then(() => {
            new Result('修改销售出库单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get(
    '/list/customer/:customerId',
    function(req,res,next){
        const customerId = req.params.customerId;
        salesstockoutService.getSalesStockoutByCustomerId(customerId).then((data)=>{
            console.log(data);
            new Result(data,'获取销售出库单信息成功').success(res)
        }).catch(err=>{
            next(boom.badImplementation(err))
        })
    }
)


module.exports = router