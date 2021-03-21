const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const purchasestockinService = require('../../service/purchase/purchasestockin')
// 采购入库单
router.get('/purchasestockinid',function(req,res,next){
    purchasestockinService.getPurchaseStockinId().then((data)=>{
        new Result(data,'获取采购入库单编号成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/add',
    function (req, res, next) {
        purchasestockinService.addPurchaseStockin(req).then(() => {
            new Result('添加采购入库单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get('/list',function(req,res,next){
    purchasestockinService.listPurchaseStockin(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取采购入库单列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const purchasestockinId = req.params.id;
    purchasestockinService.getPurchaseStockinById(purchasestockinId).then((data)=>{
        console.log(data);
        new Result(data,'获取采购入库单信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/approval',
    function (req, res, next) {
        purchasestockinService.updatePurchaseStockinApproval(req).then(() => {
            new Result('修改采购入库单审核状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/delete/:id',
    function (req, res, next) {
        const id = req.params.id;
        purchasestockinService.deletePurchaseStockin(id).then(() => {
            new Result('删除采购入库单成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        purchasestockinService.updatePurchaseStockin(req.query).then(() => {
            new Result('修改采购入库单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get(
    '/list/vendor/:vendorId',
    function(req,res,next){
        const vendorId = req.params.vendorId;
        purchasestockinService.getPurchaseStockinByVendorId(vendorId).then((data)=>{
            new Result(data,'获取采购入库单信息成功').success(res)
        }).catch(err=>{
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/settle',
    function (req, res, next) {
        purchasestockinService.updatePurchaseStockinSettle(req).then(() => {
            new Result('修改采购入库单结算状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/closing',
    function (req, res, next) {
        purchasestockinService.updatePurchaseStockinClosing(req).then(() => {
            new Result('修改采购入库单结案状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)



module.exports = router