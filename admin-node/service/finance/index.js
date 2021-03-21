const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
// const { parseTime } = require("../../utils/index")
// const { decoded } = require('../../utils/index');
// const {findStaffId} = require('../base/staff')

// 收款单据列表
async function listCollectings(query){
    debug && console.log(query)
    let {
        orderDate, //单据日期
        payDate, //收款日期
        closingStatus, //结案状态
        customerId, // 客户
        owner, //销售人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql1 = `select id,owner,DATE_FORMAT(payDate,'%Y-%m-%d %H:%i:%S') as payDate,DATE_FORMAT(orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,customerId,totalAmount,settleStatus,closingStatus from salesreturn_info`;
    let sql2 = `select id,owner,DATE_FORMAT(payDate,'%Y-%m-%d %H:%i:%S') as payDate,DATE_FORMAT(orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,customerId,totalAmount,settleStatus,closingStatus from sales_info`;
    let where = 'where';
    if(!orderDate){
        orderDate = '本月'
    }
    (orderDate&&orderDate!=='全部'&&orderDate!=='自定义') && (where = db.andDate(where,'orderDate',orderDate));
    (payDate&&payDate!=='全部'&&payDate!=='自定义') && (where = db.andDate(where,'payDate',payDate));
    (closingStatus&&closingStatus!=='全部') && (where = db.and(where,'closingStatus',closingStatus=='已结案'?1:0));
    (customerId&&customerId!=='全部') && (where = db.and(where,'customerId',customerId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql1 = `${sql1} ${where}`
        sql2 = `${sql2} ${where}`
    }
    let countSql1 = `select count(*) as b from salesreturn_info`
    let countSql2 = `select count(*) as b from sales_info`
    if(where !== 'where'){
        countSql1 = `${countSql1} ${where}`
        countSql2 = `${countSql2} ${where}`
    }
    let countSql = `select sum(a.b) as count from (${countSql1} union ${countSql2}) as a`
    const count = await db.querySql(countSql)
    let sql = `${sql1} union all ${sql2}`
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}
}

// 付款单据列表
async function listPayments(query){
    debug && console.log(query)
    let {
        orderDate, //单据日期
        payDate, //收款日期
        closingStatus, //结案状态
        vendorId, // 供应商
        owner, //采购人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql1 = `select id,owner,DATE_FORMAT(payDate,'%Y-%m-%d %H:%i:%S') as payDate,DATE_FORMAT(orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,vendorId,totalAmount,settleStatus,closingStatus from purchasereturn_info`;
    let sql2 = `select id,owner,DATE_FORMAT(payDate,'%Y-%m-%d %H:%i:%S') as payDate,DATE_FORMAT(orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,vendorId,totalAmount,settleStatus,closingStatus from purchasestockin_info`;
    let where = 'where';
    if(!orderDate){
        orderDate = '本月'
    }
    (orderDate&&orderDate!=='全部'&&orderDate!=='自定义') && (where = db.andDate(where,'orderDate',orderDate));
    (payDate&&payDate!=='全部'&&payDate!=='自定义') && (where = db.andDate(where,'payDate',payDate));
    (closingStatus&&closingStatus!=='全部') && (where = db.and(where,'closingStatus',closingStatus=='已结案'?1:0));
    (vendorId&&vendorId!=='全部') && (where = db.and(where,'vendorId',vendorId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql1 = `${sql1} ${where}`
        sql2 = `${sql2} ${where}`
    }
    let countSql1 = `select count(*) as b from purchasereturn_info`
    let countSql2 = `select count(*) as b from purchasestockin_info`
    if(where !== 'where'){
        countSql1 = `${countSql1} ${where}`
        countSql2 = `${countSql2} ${where}`
    }
    let countSql = `select sum(a.b) as count from (${countSql1} union ${countSql2}) as a`
    const count = await db.querySql(countSql)
    let sql = `${sql1} union all ${sql2}`
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}
}



module.exports = {
    listCollectings,
    listPayments
}