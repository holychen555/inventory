const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const salesService = require('../../service/sales/sales')
// 销售单
router.get('/salesid',function(req,res,next){
    salesService.getSalesId().then((data)=>{
        new Result(data,'获取销售单编号成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/add',
    function (req, res, next) {
        salesService.addSales(req).then(() => {
            new Result('添加销售单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get('/list',function(req,res,next){
    salesService.listSales(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取销售单列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const salesId = req.params.id;
    salesService.getSalesById(salesId).then((data)=>{
        console.log(data);
        new Result(data,'获取销售单信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/approval',
    function (req, res, next) {
        salesService.updateSalesApproval(req).then(() => {
            new Result('修改销售单审核状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/delete/:id',
    function (req, res, next) {
        const id = req.params.id;
        salesService.deleteSales(id).then(() => {
            new Result('删除销售单成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        salesService.updateSales(req.query).then(() => {
            new Result('修改销售单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/settle',
    function (req, res, next) {
        salesService.updateSalesSettle(req).then(() => {
            new Result('修改销售单结算状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/closing',
    function (req, res, next) {
        salesService.updateSalesClosing(req).then(() => {
            new Result('修改销售单结案状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)


module.exports = router