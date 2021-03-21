
const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
const { decoded } = require('../../utils/index');
const {findStaffId} = require('../base/staff')
// 采购退货单
async function getPurchaseReturnId() {
    const id = await db.incrementId('purchasereturn_info','id','CGTH',16,true);
    return id;
}

function addPurchaseReturn(req){
    debug && console.log(req.query)
    const {
        id,
        owner,
        returnDate,
        vendorId,
        totalAmount,
        relatedFromId
    } = req.query
    const decode = decoded(req);
   
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('采购退货单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('采购人员不能为空'));
                return
            }
            if(!returnDate){
                reject(new Error('退货日期不能为空'));
                return
            }
            if(!vendorId){
                reject(new Error('供应商不能为空'));
                return
            }
            if(!totalAmount){
                reject(new Error('总金额不能为空'));
                return
            }
           
            const {staffId} = await findStaffId(decode && decode.staffAccount);
            const purchasereturnObj = {
                id,
                owner,
                returnDate,
                vendorId,
                totalAmount: -totalAmount,
                createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                orderDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                createdBy: staffId,
                relatedFromId
            }
            await db.insert(purchasereturnObj, 'purchasereturn_info');
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

async function listPurchaseReturn(query){
    debug && console.log(query)
    let {
        returnDate, //退货日期
        approvalStatus, //审批状态
        vendorId, // 供应商
        owner, //采购人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select id,owner,DATE_FORMAT(returnDate,'%Y-%m-%d %H:%i:%S') as returnDate,vendorId,totalAmount,approvalStatus,approvalBy,createdBy,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate from purchasereturn_info`
    let where = 'where';
    if(!returnDate){
        returnDate = '本月'
    }
    (returnDate&&returnDate!=='全部'&&returnDate!=='自定义') && (where = db.andDate(where,'returnDate',returnDate));
    (approvalStatus&&approvalStatus!=='全部') && (where = db.and(where,'approvalStatus',approvalStatus));
    (vendorId&&vendorId!=='全部') && (where = db.and(where,'vendorId',vendorId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from purchasereturn_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}
}

function deletePurchaseReturn(id){
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('采购退货单不能为空'));
            return
        }
        const sql = `delete from purchasereturn_info where id='${id}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function getPurchaseReturnById(id) {
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('采购退货单编号不能为空'));
            return
        }
        const sql = `select id,owner,DATE_FORMAT(returnDate,'%Y-%m-%d %H:%i:%S') as returnDate,DATE_FORMAT(approvalDate,'%Y-%m-%d %H:%i:%S') as approvalDate,approvalMsg,vendorId,totalAmount,approvalStatus,approvalBy,relatedFromId,createdBy,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate from purchasereturn_info where id='${id}'`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updatePurchaseReturn(query){
    debug && console.log(query)
    const {
        id,
        owner,
        returnDate,
        vendorId,
        totalAmount,
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('采购退货单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('采购人员不能为空'));
                return
            }
            if(!returnDate){
                reject(new Error('退货日期不能为空'));
                return
            }
            if(!vendorId){
                reject(new Error('供应商不能为空'));
                return
            }
            if(!totalAmount){
                reject(new Error('总金额不能为空'));
                return
            }

            const purchasereturnObj = {
                id,
                owner,
                returnDate,
                vendorId,
                totalAmount,
                approvalStatus: 0
            }
            await db.update(purchasereturnObj,'purchasereturn_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function updatePurchaseReturnApproval(req){
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
            const purchasereturnObj = {
                approvalStatus,
                approvalMsg,
                approvalBy: staffId,
                approvalDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(purchasereturnObj,'purchasereturn_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

// 操作结算状态，即付款
function updatePurchaseReturnSettle(req){
    debug && console.log(req.query)
    const {
        id,
    } = req.query
    const decode = decoded(req);
    return new Promise(async (resolve, reject) => {
        try {
            const purchasereturnObj = {
                closingStatus: 1,
                settleStatus: 1,
                payDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(purchasereturnObj,'purchasereturn_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
// 操作结案状态
function updatePurchaseReturnClosing(req){
    debug && console.log(req.query)
    const {
        id,
        settleStatus,
        closingStatus,
    } = req.query
    const decode = decoded(req);
    return new Promise(async (resolve, reject) => {
        try {
            const purchasereturnObj = {
                closingStatus,
                settleStatus: closingStatus==0?0:settleStatus
            }
            await db.update(purchasereturnObj,'purchasereturn_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    listPurchaseReturn,
    deletePurchaseReturn,
    getPurchaseReturnId,
    addPurchaseReturn,
    getPurchaseReturnById,
    updatePurchaseReturn,
    updatePurchaseReturnApproval,
    updatePurchaseReturnSettle,
    updatePurchaseReturnClosing

}