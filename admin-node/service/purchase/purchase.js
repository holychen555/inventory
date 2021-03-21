
const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
const { decoded } = require('../../utils/index');
const {findStaffId} = require('../base/staff')
// 采购单
async function getPurchaseId() {
    const id = await db.incrementId('purchase_info','id','CGDD',16,true);
    return id;
}
function addPurchase(req){
    debug && console.log(req.query)
    const {
        id,
        owner,
        deliveryDate,
        orderDate,
        vendorId,
        relatedFromId,
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
            if(!vendorId){
                reject(new Error('供应商不能为空'));
                return
            }
            const {staffId} = await findStaffId(decode && decode.staffAccount);
            const purchaseObj = {
                id,
                owner,
                deliveryDate,
                orderDate,
                vendorId,
                createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                createdBy: staffId,
                relatedFromId
            }
            await db.insert(purchaseObj, 'purchase_info');
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
async function listPurchase(query){
    debug && console.log(query)
    let {
        orderDate, // 单据日期
        deliveryDate, //交货日期
        approvalStatus, //审批状态
        vendorId, // 供应商
        owner, //采购人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select id,owner,DATE_FORMAT(deliveryDate,'%Y-%m-%d %H:%i:%S') as deliveryDate,DATE_FORMAT(orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,vendorId,approvalStatus,approvalBy,relatedFromId,relatedToId from purchase_info`
    let where = 'where';
    if(!orderDate){
        orderDate = '本月'
    }
    (orderDate&&orderDate!=='全部'&&orderDate!=='自定义') && (where = db.andDate(where,'orderDate',orderDate));
    (deliveryDate&&deliveryDate!=='全部'&&deliveryDate!=='自定义') && (where = db.andDate(where,'deliveryDate',deliveryDate));
    (approvalStatus&&approvalStatus!=='全部') && (where = db.and(where,'approvalStatus',approvalStatus));
    (vendorId&&vendorId!=='全部') && (where = db.and(where,'vendorId',vendorId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from purchase_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}
}

function deletePurchase(id){
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('采购单不能为空'));
            return
        }
        const sql = `delete from purchase_info where id='${id}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function getPurchaseById(id) {
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('采购单编号不能为空'));
            return
        }
        const sql = `select id,vendorId,approvalStatus,approvalMsg,owner,DATE_FORMAT(orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,DATE_FORMAT(deliveryDate,'%Y-%m-%d %H:%i:%S') as deliveryDate,DATE_FORMAT(approvalDate,'%Y-%m-%d %H:%i:%S') as approvalDate,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,approvalBy,createdBy from purchase_info where id='${id}'`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updatePurchase(query){
    debug && console.log(query)
    const {
        id,
        owner,
        deliveryDate,
        orderDate,
        vendorId
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
            if(!vendorId){
                reject(new Error('供应商不能为空'));
                return
            }
            const purchaseObj = {
                id,
                owner,
                deliveryDate,
                orderDate,
                vendorId,
                approvalStatus: 0
            }
            await db.update(purchaseObj,'purchase_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function updatePurchaseApproval(req){
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
            const purchaseObj = {
                approvalStatus,
                approvalMsg,
                approvalBy: staffId,
                approvalDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(purchaseObj,'purchase_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    listPurchase,
    deletePurchase,
    getPurchaseId,
    addPurchase,
    getPurchaseById,
    updatePurchase,
    updatePurchaseApproval,

}