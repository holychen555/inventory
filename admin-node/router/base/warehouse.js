const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
// const { decoded } = require('../utils/index')
const warehouseService = require('../../service/base/warehouse')

router.get('/list',function(req,res,next){
    warehouseService.listWareHouse(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取仓库列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/all',function(req,res,next){
    warehouseService.getAllWareHouse().then(({list})=>{
        new Result({ list },'获取仓库列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})


router.post(
    '/delete',
    function (req, res, next) {
        const warehouseId = req.body.warehouseId;
        warehouseService.deleteWareHouse(warehouseId).then(() => {
            new Result('删除仓库成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        warehouseService.updateWareHouse(req.query).then(() => {
            new Result('修改仓库信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/add',
    function (req, res, next) {
        warehouseService.addWareHouse(req.query).then(() => {
            new Result('添加仓库信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

module.exports = router