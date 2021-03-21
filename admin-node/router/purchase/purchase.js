const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const { decoded } = require('../../utils/index')
const purchaseService = require('../../service/purchase/purchase')
// 采购单
router.get('/purchaseid',function(req,res,next){
    purchaseService.getPurchaseId().then((data)=>{
        new Result(data,'获取采购单编号成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/add',
    function (req, res, next) {
        purchaseService.addPurchase(req).then(() => {
            new Result('添加采购单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get('/list',function(req,res,next){
    purchaseService.listPurchase(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取采购单列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const purchaseId = req.params.id;
    purchaseService.getPurchaseById(purchaseId).then((data)=>{
        console.log(data);
        new Result(data,'获取采购单信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/approval',
    function (req, res, next) {
        purchaseService.updatePurchaseApproval(req).then(() => {
            new Result('修改采购单审核状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/delete/:id',
    function (req, res, next) {
        const id = req.params.id;
        purchaseService.deletePurchase(id).then(() => {
            new Result('删除采购单成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        purchaseService.updatePurchase(req.query).then(() => {
            new Result('修改采购单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)


module.exports = router