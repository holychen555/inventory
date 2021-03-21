
const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
const { decoded } = require('../../utils/index');
const {findStaffId} = require('../base/staff')
// 销售退货单
async function getSalesReturnId() {
    const id = await db.incrementId('salesreturn_info','id','XSTH',16,true);
    return id;
}

function addSalesReturn(req){
    debug && console.log(req.query)
    const {
        id,
        owner,
        returnDate,
        customerId,
        totalAmount,
        relatedFromId
    } = req.query
    const decode = decoded(req);
   
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('销售退货单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('销售人员不能为空'));
                return
            }
            if(!returnDate){
                reject(new Error('退货日期不能为空'));
                return
            }
            if(!customerId){
                reject(new Error('客户不能为空'));
                return
            }
            if(!totalAmount){
                reject(new Error('总金额不能为空'));
                return
            }
           
            const {staffId} = await findStaffId(decode && decode.staffAccount);
            const salesreturnObj = {
                id,
                owner,
                returnDate,
                customerId,
                totalAmount: -totalAmount,
                createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                orderDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                createdBy: staffId,
                relatedFromId
            }
            await db.insert(salesreturnObj, 'salesreturn_info');
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

async function listSalesReturn(query){
    debug && console.log(query)
    let {
        returnDate, //退货日期
        approvalStatus, //审批状态
        customerId, // 客户
        owner, //销售人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select id,owner,DATE_FORMAT(returnDate,'%Y-%m-%d %H:%i:%S') as returnDate,customerId,totalAmount,approvalStatus,approvalBy,createdBy,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate from salesreturn_info`
    let where = 'where';
    if(!returnDate){
        returnDate = '本月'
    }
    (returnDate&&returnDate!=='全部'&&returnDate!=='自定义') && (where = db.andDate(where,'returnDate',returnDate));
    (approvalStatus&&approvalStatus!=='全部') && (where = db.and(where,'approvalStatus',approvalStatus));
    (customerId&&customerId!=='全部') && (where = db.and(where,'customerId',customerId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from salesreturn_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}
}

function deleteSalesReturn(id){
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('销售退货单不能为空'));
            return
        }
        const sql = `delete from salesreturn_info where id='${id}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function getSalesReturnById(id) {
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('销售退货单编号不能为空'));
            return
        }
        const sql = `select id,owner,DATE_FORMAT(returnDate,'%Y-%m-%d %H:%i:%S') as returnDate,DATE_FORMAT(approvalDate,'%Y-%m-%d %H:%i:%S') as approvalDate,approvalMsg,customerId,totalAmount,approvalStatus,approvalBy,relatedFromId,createdBy,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate from salesreturn_info where id='${id}'`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updateSalesReturn(query){
    debug && console.log(query)
    const {
        id,
        owner,
        returnDate,
        customerId,
        totalAmount,
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('销售退货单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('销售人员不能为空'));
                return
            }
            if(!returnDate){
                reject(new Error('退货日期不能为空'));
                return
            }
            if(!customerId){
                reject(new Error('客户不能为空'));
                return
            }
            if(!totalAmount){
                reject(new Error('总金额不能为空'));
                return
            }

            const salesreturnObj = {
                id,
                owner,
                returnDate,
                customerId,
                totalAmount,
                approvalStatus: 0
            }
            await db.update(salesreturnObj,'salesreturn_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function updateSalesReturnApproval(req){
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
            const salesreturnObj = {
                approvalStatus,
                approvalMsg,
                approvalBy: staffId,
                approvalDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(salesreturnObj,'salesreturn_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
// 操作结算状态，即收款
function updateSalesReturnSettle(req){
    debug && console.log(req.query)
    const {
        id,
    } = req.query
    const decode = decoded(req);
    return new Promise(async (resolve, reject) => {
        try {
            const salesObj = {
                closingStatus: 1,
                settleStatus: 1,
                payDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(salesObj,'salesreturn_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
// 操作结案状态
function updateSalesReturnClosing(req){
    debug && console.log(req.query)
    const {
        id,
        settleStatus,
        closingStatus,
    } = req.query
    const decode = decoded(req);
    return new Promise(async (resolve, reject) => {
        try {
            const salesObj = {
                closingStatus,
                settleStatus: closingStatus==0?0:settleStatus
            }
            await db.update(salesObj,'salesreturn_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    listSalesReturn,
    deleteSalesReturn,
    getSalesReturnId,
    addSalesReturn,
    getSalesReturnById,
    updateSalesReturn,
    updateSalesReturnApproval,
    updateSalesReturnSettle,
    updateSalesReturnClosing

}