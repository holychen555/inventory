
const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
const { decoded } = require('../../utils/index');
const {findStaffId} = require('../base/staff')
// 销售出库单
async function getSalesStockoutId() {
    const id = await db.incrementId('salesstockout_info','id','XSCK',16,true);
    return id;
}
function addSalesStockout(req){
    debug && console.log(req.query)
    const {
        id,
        owner,
        deliveryDate,
        customerId,
        totalAmount,
        recipientName,
        recipientPhone,
        recipientAddress,
        relatedFromId
    } = req.query
    const decode = decoded(req);
   
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('销售出库单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('销售人员不能为空'));
                return
            }
            if(!deliveryDate){
                reject(new Error('出库日期不能为空'));
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
            const salesstockoutObj = {
                id,
                owner,
                deliveryDate,
                customerId,
                totalAmount,
                recipientName,
                recipientPhone,
                recipientAddress,
                createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                createdBy: staffId,
                relatedFromId
            }
            await db.insert(salesstockoutObj, 'salesstockout_info');
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
async function listSalesStockout(query){
    debug && console.log(query)
    let {
        deliveryDate, //出库日期
        approvalStatus, //审批状态
        customerId, // 客户
        owner, //销售人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select id,owner,DATE_FORMAT(deliveryDate,'%Y-%m-%d %H:%i:%S') as deliveryDate,customerId,totalAmount,approvalStatus,approvalBy,relatedToId,createdBy,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate from salesstockout_info`
    let where = 'where';
    if(!deliveryDate){
        deliveryDate = '本月'
    }
    (deliveryDate&&deliveryDate!=='全部'&&deliveryDate!=='自定义') && (where = db.andDate(where,'deliveryDate',deliveryDate));
    (approvalStatus&&approvalStatus!=='全部') && (where = db.and(where,'approvalStatus',approvalStatus));
    (customerId&&customerId!=='全部') && (where = db.and(where,'customerId',customerId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from salesstockout_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}
}

function deleteSalesStockout(id){
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('销售出库单不能为空'));
            return
        }
        const sql = `delete from salesstockout_info where id='${id}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function getSalesStockoutById(id) {
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('销售出库单编号不能为空'));
            return
        }
        const sql = `select id,owner,DATE_FORMAT(deliveryDate,'%Y-%m-%d %H:%i:%S') as deliveryDate,DATE_FORMAT(approvalDate,'%Y-%m-%d %H:%i:%S') as approvalDate,approvalMsg,customerId,totalAmount,approvalStatus,approvalBy,relatedToId,relatedFromId,createdBy,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,recipientName,recipientPhone,recipientAddress from salesstockout_info where id='${id}'`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updateSalesStockout(query){
    debug && console.log(query)
    const {
        id,
        owner,
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
                reject(new Error('销售出库单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('销售人员不能为空'));
                return
            }
            if(!deliveryDate){
                reject(new Error('出库日期不能为空'));
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
            const salesstockoutObj = {
                id,
                owner,
                deliveryDate,
                customerId,
                totalAmount,
                recipientName,
                recipientPhone,
                recipientAddress,
                approvalStatus: 0
            }
            await db.update(salesstockoutObj,'salesstockout_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function updateSalesStockoutApproval(req){
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
            const salesstockoutObj = {
                approvalStatus,
                approvalMsg,
                approvalBy: staffId,
                approvalDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(salesstockoutObj,'salesstockout_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function getSalesStockoutByCustomerId(id) {
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('销售出库单编号不能为空'));
            return
        }
        const sql = `select id from salesstockout_info where customerId='${id}'`
        const data = await db.querySql(sql);
        resolve(data);
    })
}

module.exports = {
    listSalesStockout,
    deleteSalesStockout,
    getSalesStockoutId,
    addSalesStockout,
    getSalesStockoutById,
    updateSalesStockout,
    updateSalesStockoutApproval,
    getSalesStockoutByCustomerId

}