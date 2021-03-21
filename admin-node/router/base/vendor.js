const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const { decoded } = require('../../utils/index')
const vendorService = require('../../service/base/vendor')

router.get('/list/name',function(req,res,next){
    vendorService.getAllVendorByName(req.query).then(({list})=>{
        new Result({ list },'获取供应商列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list',function(req,res,next){
    vendorService.listVendor(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取供应商列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const vendorId = req.params.id;
    vendorService.getVendorById(vendorId).then((data)=>{
        console.log(data);
        new Result(data,'获取供应商信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/delete',
    function (req, res, next) {
        const vendor = req.body.vendorIdList;
        vendorService.deleteVendor(vendor).then(() => {
            new Result('删除供应商成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        vendorService.updateVendor(req.query).then(() => {
            new Result('修改供应商信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/add',
    function (req, res, next) {
        vendorService.addVendor(req.query).then(() => {
            new Result('添加供应商信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

module.exports = router