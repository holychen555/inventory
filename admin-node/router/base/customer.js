const express = require("express")
const Result = require("../../models/Result")
const router = express.Router()
const boom = require('boom')
const { decoded } = require('../../utils/index')
const customerService = require('../../service/base/customer')

router.get('/list/name',function(req,res,next){
    customerService.getAllCustomerByName(req.query).then(({list})=>{
        new Result({ list },'获取客户列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list',function(req,res,next){
    customerService.listCustomer(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取客户列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.get('/list/:id',function(req,res,next){
    const customerId = req.params.id;
    customerService.getCustomerById(customerId).then((data)=>{
        console.log(data);
        new Result(data,'获取客户信息成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})

router.post(
    '/delete',
    function (req, res, next) {
        const customer = req.body.customerIdList;
        customerService.deleteCustomer(customer).then(() => {
            new Result('删除客户成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        customerService.updateCustomer(req.query).then(() => {
            new Result('修改客户信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/add',
    function (req, res, next) {
        customerService.addCustomer(req.query).then(() => {
            new Result('添加客户信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

module.exports = router