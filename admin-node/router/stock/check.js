const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const checkService = require('../../service/stock/check')
// 盘点单
router.get('/checkid',function(req,res,next){
    checkService.getCheckId().then((data)=>{
        new Result(data,'获取盘点单编号成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/add',
    function (req, res, next) {
        checkService.addCheck(req).then(() => {
            new Result('添加盘点单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.get('/list',function(req,res,next){
    checkService.listCheck(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取盘点单列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const checkId = req.params.id;
    checkService.getCheckById(checkId).then((data)=>{
        console.log(data);
        new Result(data,'获取盘点单信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/approval',
    function (req, res, next) {
        checkService.updateCheckApproval(req).then(() => {
            new Result('修改盘点单审核状态成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/delete/:id',
    function (req, res, next) {
        const id = req.params.id;
        checkService.deleteCheck(id).then(() => {
            new Result('删除盘点单成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        checkService.updateCheck(req.query).then(() => {
            new Result('修改盘点单信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)


module.exports = router