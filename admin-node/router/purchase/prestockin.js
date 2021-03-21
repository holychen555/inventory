const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const { decoded } = require('../../utils/index')
const prestockinService = require('../../service/purchase/prestockin')
// 预入库单
router.get('/prestockinid',function(req,res,next){
    prestockinService.getPreStockinId().then((data)=>{
        new Result(data,'获取预入库单编号成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/add',
    function (req, res, next) {
        prestockinService.addPreStockin(req).then(() => {
            new Result('添加预入库单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get('/list',function(req,res,next){
    prestockinService.listPreStockin(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取预入库单列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const prestockinId = req.params.id;
    prestockinService.getPreStockinById(prestockinId).then((data)=>{
        console.log(data);
        new Result(data,'获取预入库单信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/approval',
    function (req, res, next) {
        prestockinService.updatePreStockinApproval(req).then(() => {
            new Result('修改预入库单审核状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/delete/:id',
    function (req, res, next) {
        const id = req.params.id;
        prestockinService.deletePreStockin(id).then(() => {
            new Result('删除预入库单成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        prestockinService.updatePreStockin(req.query).then(() => {
            new Result('修改预入库单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)


module.exports = router