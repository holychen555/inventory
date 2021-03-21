const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const purchasereturnService = require('../../service/purchase/purchasereturn')
// 采购退货单
router.get('/purchasereturnid',function(req,res,next){
    purchasereturnService.getPurchaseReturnId().then((data)=>{
        new Result(data,'获取采购退货单编号成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/add',
    function (req, res, next) {
        purchasereturnService.addPurchaseReturn(req).then(() => {
            new Result('添加采购退货单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get('/list',function(req,res,next){
    purchasereturnService.listPurchaseReturn(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取采购退货单列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const purchaseId = req.params.id;
    purchasereturnService.getPurchaseReturnById(purchaseId).then((data)=>{
        console.log(data);
        new Result(data,'获取采购退货单信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/approval',
    function (req, res, next) {
        purchasereturnService.updatePurchaseReturnApproval(req).then(() => {
            new Result('修改采购退货单审核状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/delete/:id',
    function (req, res, next) {
        const id = req.params.id;
        purchasereturnService.deletePurchaseReturn(id).then(() => {
            new Result('删除采购退货单成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        purchasereturnService.updatePurchaseReturn(req.query).then(() => {
            new Result('修改采购退货单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/settle',
    function (req, res, next) {
        purchasereturnService.updatePurchaseReturnSettle(req).then(() => {
            new Result('修改采购退货单结算状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/closing',
    function (req, res, next) {
        purchasereturnService.updatePurchaseReturnClosing(req).then(() => {
            new Result('修改采购退货单结案状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)




module.exports = router