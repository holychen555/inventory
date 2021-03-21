const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const { decoded } = require('../../utils/index')
const prepurchaseService = require('../../service/purchase/prepurchase')

// 预采购单
router.get('/prepurchaseid',function(req,res,next){
    prepurchaseService.getPrePurchaseId().then((data)=>{
        new Result(data,'获取预采购单编号成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/add',
    function (req, res, next) {
        prepurchaseService.addPrePurchase(req).then(() => {
            new Result('添加预采购单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get('/list',function(req,res,next){
    prepurchaseService.listPrePurchase(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取预采购单列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const purchaseId = req.params.id;
    prepurchaseService.getPrePurchaseById(purchaseId).then((data)=>{
        console.log(data);
        new Result(data,'获取预采购单信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})



router.post(
    '/approval',
    function (req, res, next) {
        prepurchaseService.updatePrePurchaseApproval(req).then(() => {
            new Result('修改预采购单审核状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/delete/:id',
    function (req, res, next) {
        const id = req.params.id;
        prepurchaseService.deletePrePurchase(id).then(() => {
            new Result('删除预采购单成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        prepurchaseService.updatePrePurchase(req.query).then(() => {
            new Result('修改预采购单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)


module.exports = router