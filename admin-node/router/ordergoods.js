const express = require("express")
const Result = require("../models/Result")
const router = express.Router()
const boom = require('boom')
const { decoded } = require('../utils/index')
const ordergoodsService = require('../service/ordergoods')
// 单据商品接口
router.post(
    '/add',
    function (req, res, next) {
        console.log(req.body);
        ordergoodsService.addOrderGoodsList(req.body).then(() => {
            new Result('添加单据商品信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        console.log(req.body);
        ordergoodsService.updateOrderGoodsList(req.body).then(() => {
            new Result('更新单据商品信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get('/orderid/:orderId',function(req,res,next){
    const orderId = req.params.orderId;
    ordergoodsService.getOrderGoods(orderId).then((data)=>{
        new Result(data,'获取单据商品成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post('/delete/:orderId',function(req,res,next){
    const orderId = req.params.orderId;
    ordergoodsService.deleteOrderGoods(orderId).then((data)=>{
        new Result(data,'删除单据商品成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})



// router.get('/list',function(req,res,next){
//     ordergoodsService.listPurchase(req.query).then(({list,count,page,pageSize})=>{
//         new Result({ list,count,page:+page,pageSize:+pageSize },'获取采购单列表成功').success(res)
//     }).catch(err=>{
//         next(boom.badImplementation(err))
//     })
// })

// router.get('/list/:id',function(req,res,next){
//     const purchaseId = req.params.id;
//     ordergoodsService.getPurchaseById(purchaseId).then((data)=>{
//         console.log(data);
//         new Result(data,'获取采购单信息成功').success(res)
//     }).catch(err=>{
//         next(boom.badImplementation(err))
//     })
// })



// router.post(
//     '/update',
//     function (req, res, next) {
//         ordergoodsService.updatePurchase(req.query).then(() => {
//             new Result('修改采购单信息成功').success(res)
//         }).catch(err => {
//             next(boom.badImplementation(err))
//         })
//     }
// )

// router.post(
//     '/delete',
//     function (req, res, next) {
//         const id = req.body.id;
//         ordergoodsService.deletePurchase(id).then(() => {
//             new Result('删除采购单成功').success(res)
//         }).catch(err => {
//             next(boom.badImplementation(err))
//         })
//     }
// )




module.exports = router