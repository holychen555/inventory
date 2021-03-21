
const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
const { decoded } = require('../../utils/index');
const {findStaffId} = require('../base/staff')
// 采购入库单
async function getPurchaseStockinId() {
    const id = await db.incrementId('purchasestockin_info','id','CGRK',16,true);
    return id;
}
function addPurchaseStockin(req){
    debug && console.log(req.query)
    const {
        id,
        owner,
        totalAmount,
        stockingDate,
        vendorId,
        relatedFromId,
    } = req.query
    const decode = decoded(req);
   
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('采购入库单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('采购人员不能为空'));
                return
            }
            if(!totalAmount){
                reject(new Error('总金额不能为空'));
                return
            }
            if(!stockingDate){
                reject(new Error('入库日期不能为空'));
                return
            }
            if(!vendorId){
                reject(new Error('供应商不能为空'));
                return
            }
            const {staffId} = await findStaffId(decode && decode.staffAccount);
            const prestockinObj = {
                id,
                owner,
                stockingDate,
                vendorId,
                createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                orderDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                createdBy: staffId,
                relatedFromId,
                totalAmount
            }
            await db.insert(prestockinObj, 'purchasestockin_info');
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
async function listPurchaseStockin(query){
    debug && console.log(query)
    let {
        stockingDate, //入库日期
        approvalStatus, //审批状态
        vendorId, // 供应商
        owner, //采购人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select id,owner,DATE_FORMAT(stockingDate,'%Y-%m-%d %H:%i:%S') as stockingDate,vendorId,approvalStatus,approvalBy,relatedFromId from purchasestockin_info`
    let where = 'where';
    if(!stockingDate){
        stockingDate = '本月'
    }
    (stockingDate&&stockingDate!=='全部'&&stockingDate!=='自定义') && (where = db.andDate(where,'stockingDate',stockingDate));
    (approvalStatus&&approvalStatus!=='全部') && (where = db.and(where,'approvalStatus',approvalStatus));
    (vendorId&&vendorId!=='全部') && (where = db.and(where,'vendorId',vendorId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from purchasestockin_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}
}

function deletePurchaseStockin(id){
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('采购入库单不能为空'));
            return
        }
        const sql = `delete from purchasestockin_info where id='${id}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function getPurchaseStockinById(id) {
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('采购入库单编号不能为空'));
            return
        }
        const sql = `select id,vendorId,approvalStatus,approvalMsg,owner,DATE_FORMAT(stockingDate,'%Y-%m-%d %H:%i:%S') as stockingDate,DATE_FORMAT(approvalDate,'%Y-%m-%d %H:%i:%S') as approvalDate,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,approvalBy,createdBy from purchasestockin_info where id='${id}'`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updatePurchaseStockin(query){
    debug && console.log(query)
    const {
        id,
        owner,
        stockingDate,
        vendorId
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('采购入库单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('采购人员不能为空'));
                return
            }
            if(!stockingDate){
                reject(new Error('入库日期不能为空'));
                return
            }
            if(!vendorId){
                reject(new Error('供应商不能为空'));
                return
            }
            const prestockinObj = {
                id,
                owner,
                stockingDate,
                vendorId,
                approvalStatus: 0
            }
            await db.update(prestockinObj,'purchasestockin_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function updatePurchaseStockinApproval(req){
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
            const prestockinObj = {
                approvalStatus,
                approvalMsg,
                approvalBy: staffId,
                approvalDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(prestockinObj,'purchasestockin_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function getPurchaseStockinByVendorId(id) {
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('采购入库单编号不能为空'));
            return
        }
        const sql = `select id from purchasestockin_info where vendorId='${id}'`
        const data = await db.querySql(sql);
        resolve(data);
    })
}

// 操作结算状态，即付款
function updatePurchaseStockinSettle(req){
    debug && console.log(req.query)
    const {
        id,
    } = req.query
    const decode = decoded(req);
    return new Promise(async (resolve, reject) => {
        try {
            const purchasestockinObj = {
                closingStatus: 1,
                settleStatus: 1,
                payDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(purchasestockinObj,'purchasestockin_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
// 操作结案状态
function updatePurchaseStockinClosing(req){
    debug && console.log(req.query)
    const {
        id,
        settleStatus,
        closingStatus,
    } = req.query
    const decode = decoded(req);
    return new Promise(async (resolve, reject) => {
        try {
            const purchasestockinObj = {
                closingStatus,
                settleStatus: closingStatus==0?0:settleStatus
            }
            await db.update(purchasestockinObj,'purchasestockin_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    listPurchaseStockin,
    deletePurchaseStockin,
    getPurchaseStockinId,
    addPurchaseStockin,
    getPurchaseStockinById,
    updatePurchaseStockin,
    updatePurchaseStockinApproval,
    getPurchaseStockinByVendorId,
    updatePurchaseStockinSettle,
    updatePurchaseStockinClosing

}