
// const Book = require('../models/Book')
const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
const { decoded } = require('../../utils/index');
const {findStaffId} = require('../base/staff')
// 预采购单
async function getPrePurchaseId() {
    const id = await db.incrementId('prepurchase_info','id','YCGD',16,true);
    return id;
}

function addPrePurchase(req){
    debug && console.log(req.query)
    const {
        id,
        owner,
        deliveryDate,
        orderDate,
    } = req.query
    const decode = decoded(req);
   
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('采购单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('采购人员不能为空'));
                return
            }
            if(!deliveryDate){
                reject(new Error('交货日期不能为空'));
                return
            }
            if(!orderDate){
                reject(new Error('单据日期不能为空'));
                return
            }
            const {staffId} = await findStaffId(decode && decode.staffAccount);
            const prepurchaseObj = {
                id,
                owner,
                deliveryDate,
                orderDate,
                createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                createdBy: staffId
            }
            await db.insert(prepurchaseObj, 'prepurchase_info');
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

async function listPrePurchase(query){
    debug && console.log(query)
    let {
        orderDate, // 单据日期
        deliveryDate, //交货日期
        approvalStatus, //审批状态
        owner, //采购人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select id,owner,DATE_FORMAT(deliveryDate,'%Y-%m-%d %H:%i:%S') as deliveryDate,DATE_FORMAT(orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,approvalStatus,approvalBy,relatedToId from prepurchase_info`
    let where = 'where';
    if(!orderDate){
        orderDate = '本月'
    }
    (orderDate&&orderDate!=='全部'&&orderDate!=='自定义') && (where = db.andDate(where,'orderDate',orderDate));
    (deliveryDate&&deliveryDate!=='全部'&&deliveryDate!=='自定义') && (where = db.andDate(where,'deliveryDate',deliveryDate));
    (approvalStatus&&approvalStatus!=='全部') && (where = db.and(where,'approvalStatus',approvalStatus));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from prepurchase_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}
}

function deletePrePurchase(id){
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('预采购单不能为空'));
            return
        }
        const sql = `delete from prepurchase_info where id='${id}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function getPrePurchaseById(id) {
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('预采购单编号不能为空'));
            return
        }
        const sql = `select id,approvalStatus,approvalMsg,owner,DATE_FORMAT(orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,DATE_FORMAT(deliveryDate,'%Y-%m-%d %H:%i:%S') as deliveryDate,DATE_FORMAT(approvalDate,'%Y-%m-%d %H:%i:%S') as approvalDate,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,approvalBy,createdBy from prepurchase_info where id='${id}'`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updatePrePurchase(query){
    debug && console.log(query)
    const {
        id,
        owner,
        deliveryDate,
        orderDate,
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            // if(approvalStatus==1){
            //     reject(new Error('该状态不可修改'));
            //     return
            // }
            if(!id){
                reject(new Error('采购单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('采购人员不能为空'));
                return
            }
            if(!deliveryDate){
                reject(new Error('交货日期不能为空'));
                return
            }
            if(!orderDate){
                reject(new Error('单据日期不能为空'));
                return
            }
            const prepurchaseObj = {
                id,
                owner,
                deliveryDate,
                orderDate,
                approvalStatus: 0
            }
            await db.update(prepurchaseObj,'prepurchase_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function updatePrePurchaseApproval(req){
    debug && console.log(req.query)
    const {
        id,
        approvalStatus,
        approvalMsg
    } = req.query
    const decode = decoded(req);
    return new Promise(async (resolve, reject) => {
        try {
            const {staffId} = await findStaffId(decode && decode.staffAccount);
            const prepurchaseObj = {
                approvalStatus,
                approvalMsg,
                approvalBy: staffId,
                approvalDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(prepurchaseObj,'prepurchase_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getPrePurchaseId,
    addPrePurchase,
    listPrePurchase,
    deletePrePurchase,
    getPrePurchaseById,
    updatePrePurchase,
    updatePrePurchaseApproval,

}