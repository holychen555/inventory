const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const { decoded } = require('../../utils/index')
const goodsService = require('../../service/base/goods')


router.get('/category',function(req,res,next){
    goodsService.getGoodsCategory().then(category=>{
        new Result(category,'获取分类成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/category/add',
    function (req, res, next) {
        const categoryName = req.body.categoryName;
        goodsService.addGoodsCategory(categoryName).then(() => {
            new Result('新增分类成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)


router.post(
    '/category/update',
    function (req, res, next) {
        const category = req.body;
        console.log(req);
        goodsService.updateGoodsCategory(category).then(() => {
            new Result('修改分类成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/category/delete',
    function (req, res, next) {
        const categoryName = req.body.categoryName;
        goodsService.deleteGoodsCategory(categoryName).then(() => {
            new Result('删除分类成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get('/list',function(req,res,next){
    goodsService.listGoods(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取商品列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const goodsId = req.params.id;
    goodsService.getGoodsById(goodsId).then((data)=>{
        console.log(data);
        new Result(data,'获取商品信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/delete',
    function (req, res, next) {
        const goods = req.body.goodsIdList;
        goodsService.deleteGoods(goods).then(() => {
            new Result('删除商品成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        goodsService.updateGoods(req.query).then(() => {
            new Result('修改商品信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/add',
    function (req, res, next) {
        goodsService.addGoods(req.query).then(() => {
            new Result('添加商品信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post('/togglestatus',function(req,res,next){
    goodsService.toggleGoodsDisabled(req.query).then((msg)=>{
        new Result(msg+'成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/name/:name',function(req,res,next){
    const goodsName = req.params.name;
    goodsService.getGoodsByName(goodsName).then((data)=>{
        console.log(data);
        new Result(data,'获取商品信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})
module.exports = router
