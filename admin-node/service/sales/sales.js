
const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
const { decoded } = require('../../utils/index');
const {findStaffId} = require('../base/staff')
// 销售单
async function getSalesId() {
    const id = await db.incrementId('sales_info','id','XSDD',16,true);
    return id;
}
function addSales(req){
    debug && console.log(req.query)
    const {
        id,
        owner,
        orderDate,
        deliveryDate,
        customerId,
        totalAmount,
        recipientName,
        recipientPhone,
        recipientAddress,
    } = req.query
    const decode = decoded(req);
   
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('销售单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('销售人员不能为空'));
                return
            }
            if(!orderDate){
                reject(new Error('单据日期不能为空'));
                return
            }
            if(!deliveryDate){
                reject(new Error('交货日期不能为空'));
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
            if(!recipientName){
                reject(new Error('收件人不能为空'))
            }
            if(!recipientPhone){
                reject(new Error('收件人手机不能为空'))
            }
            if(!recipientAddress){
                reject(new Error('收件人地址不能为空'))
            }
           
            const {staffId} = await findStaffId(decode && decode.staffAccount);
            const salesObj = {
                id,
                owner,
                orderDate,
                deliveryDate,
                customerId,
                totalAmount,
                recipientName,
                recipientPhone,
                recipientAddress,
                createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                createdBy: staffId,
            }
            await db.insert(salesObj, 'sales_info');
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
async function listSales(query){
    debug && console.log(query)
    let {
        orderDate, //单据日期
        deliveryDate, //交货日期
        approvalStatus, //审批状态
        customerId, // 客户
        owner, //销售人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select id,owner,DATE_FORMAT(orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,DATE_FORMAT(deliveryDate,'%Y-%m-%d %H:%i:%S') as deliveryDate,customerId,totalAmount,approvalStatus,approvalBy,relatedToId,createdBy,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate from sales_info`
    let where = 'where';
    if(!orderDate){
        orderDate = '本月'
    }
    (orderDate&&orderDate!=='全部'&&orderDate!=='自定义') && (where = db.andDate(where,'orderDate',orderDate));
    (deliveryDate&&deliveryDate!=='全部'&&deliveryDate!=='自定义') && (where = db.andDate(where,'deliveryDate',deliveryDate));
    (approvalStatus&&approvalStatus!=='全部') && (where = db.and(where,'approvalStatus',approvalStatus));
    (customerId&&customerId!=='全部') && (where = db.and(where,'customerId',customerId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from sales_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}
}

function deleteSales(id){
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('销售单不能为空'));
            return
        }
        const sql = `delete from sales_info where id='${id}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function getSalesById(id) {
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('销售单编号不能为空'));
            return
        }
        const sql = `select id,owner,DATE_FORMAT(orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,DATE_FORMAT(deliveryDate,'%Y-%m-%d %H:%i:%S') as deliveryDate,DATE_FORMAT(approvalDate,'%Y-%m-%d %H:%i:%S') as approvalDate,approvalMsg,customerId,totalAmount,approvalStatus,approvalBy,relatedToId,createdBy,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,recipientName,recipientPhone,recipientAddress from sales_info where id='${id}'`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updateSales(query){
    debug && console.log(query)
    const {
        id,
        owner,
        orderDate,
        deliveryDate,
        customerId,
        totalAmount,
        recipientName,
        recipientPhone,
        recipientAddress,
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('销售单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('销售人员不能为空'));
                return
            }
            if(!orderDate){
                reject(new Error('单据日期不能为空'));
                return
            }
            if(!deliveryDate){
                reject(new Error('交货日期不能为空'));
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
            if(!recipientName){
                reject(new Error('收件人不能为空'))
            }
            if(!recipientPhone){
                reject(new Error('收件人手机不能为空'))
            }
            if(!recipientAddress){
                reject(new Error('收件人地址不能为空'))
            }
            const salesObj = {
                id,
                owner,
                orderDate,
                deliveryDate,
                customerId,
                totalAmount,
                recipientName,
                recipientPhone,
                recipientAddress,
                approvalStatus: 0
            }
            await db.update(salesObj,'sales_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function updateSalesApproval(req){
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
            const salesObj = {
                approvalStatus,
                approvalMsg,
                approvalBy: staffId,
                approvalDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(salesObj,'sales_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
// 操作结算状态，即收款
function updateSalesSettle(req){
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
            await db.update(salesObj,'sales_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
// 操作结案状态
function updateSalesClosing(req){
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
            await db.update(salesObj,'sales_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    listSales,
    deleteSales,
    getSalesId,
    addSales,
    getSalesById,
    updateSales,
    updateSalesApproval,
    updateSalesSettle,
    updateSalesClosing

}