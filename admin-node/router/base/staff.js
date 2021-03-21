const express = require("express");
const { login,findStaff } = require("../../service/base/staff");
const Result = require('../../models/Result');
const boom = require('boom')
const {body,validationResult} = require('express-validator');
const { PWD_SALT, JWT_EXPIRED,PRIVATE_KEY } = require("../../utils/constant");
const { md5,decoded } = require('../../utils/index');
const jwt = require('jsonwebtoken')
const router = express.Router();
const staffService = require('../../service/base/staff')

router.get('/info',function(req,res){
    const decode = decoded(req);
    console.log("decode----------------")
    console.log(decode)
    if(decode && decode.staffAccount){
        findStaff(decode.staffAccount).then(user=>{
            console.log(user);
            if(user){
                new Result(user,'用户信息查询成功').success(res)
            }else {
                new Result(user,'用户信息查询失败').fail(res)
            }
        })
    }else {
        new Result(user,'用户信息查询失败').fail(res)
    }
})
router.post(
    '/login',
    [
        body('staffAccount').isString().withMessage('Account类型不正确'),
        body('staffPassword').isString().withMessage('Password类型不正确')
    ],
    function(req,res,next){
        const err = validationResult(req)
        console.log(err);
        if(!err.isEmpty()){
            const [{msg}] = err.errors;
            // errors: [
            //     {
            //       value: 'admin',
            //       msg: 'staffPassword必须为数字',
            //       param: 'staffPassword',
            //       location: 'body'
            //     }
            //   ]
            next(boom.badRequest(msg))
        }else{
            const staffAccount = req.body.staffAccount;
            const staffPassword = md5(`${req.body.staffPassword}${PWD_SALT}`)
            login(staffAccount,staffPassword).then(user => {
                if(!user || user.length === 0){
                    new Result('登录失败').fail(res);
                }else {
                    const token = jwt.sign(
                        { staffAccount },
                        PRIVATE_KEY,
                        {expiresIn: JWT_EXPIRED}
                    )
                    new Result({token},'登录成功').success(res);
                }
            })
        }
})

router.get('/list/all',function(req,res,next){
    staffService.getAllStaff().then(({list})=>{
        new Result({ list },'获取用户列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})


router.get('/list',function(req,res,next){
    staffService.listStaff(req.query).then(({list,count,page,pageSize})=>{
        new Result({ list,count,page:+page,pageSize:+pageSize },'获取用户列表成功').success(res)
    }).catch(err=>{
        next(boom.badImplementation(err))
    })
})


router.post(
    '/delete',
    function (req, res, next) {
        const staffIdList = req.body.staffIdList;
        staffService.deleteStaff(staffIdList).then(() => {
            new Result('删除用户成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/update',
    function (req, res, next) {
        staffService.updateStaff(req.query).then(() => {
            new Result('修改用户信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

router.post(
    '/add',
    function (req, res, next) {
        staffService.addStaff(req.query).then(() => {
            new Result('添加用户信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
)

module.exports = router