const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const salesreturnService = require('../../service/sales/salesreturn')
// 销售退货单
router.get('/salesreturnid',function(req,res,next){
    salesreturnService.getSalesReturnId().then((data)=>{
        new Result(data,'获取销售退货单编号成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/add',
    function (req, res, next) {
        salesreturnService.addSalesReturn(req).then(() => {
            new Result('添加销售退货单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get('/list',function(req,res,next){
    salesreturnService.listSalesReturn(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取销售退货单列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const salesId = req.params.id;
    salesreturnService.getSalesReturnById(salesId).then((data)=>{
        console.log(data);
        new Result(data,'获取销售退货单信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/approval',
    function (req, res, next) {
        salesreturnService.updateSalesReturnApproval(req).then(() => {
            new Result('修改销售退货单审核状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/delete/:id',
    function (req, res, next) {
        const id = req.params.id;
        salesreturnService.deleteSalesReturn(id).then(() => {
            new Result('删除销售退货单成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        salesreturnService.updateSalesReturn(req.query).then(() => {
            new Result('修改销售退货单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/settle',
    function (req, res, next) {
        salesreturnService.updateSalesReturnSettle(req).then(() => {
            new Result('修改销售退货单结算状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/closing',
    function (req, res, next) {
        salesreturnService.updateSalesReturnClosing(req).then(() => {
            new Result('修改销售退货单结案状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)


module.exports = router