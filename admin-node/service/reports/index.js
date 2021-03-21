const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
// 采购明细报表
async function listPurchaseReport(query){
    debug && console.log(query)
    let {
        type, // 单据类型
        orderDate, // 单据日期
        approvalStatus, //审批状态
        vendorId, // 供应商
        owner, //采购人员
        goodsName, //商品名称
        warehouseId, //仓库
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql1 = `select og.orderId,og.goodsId,og.goodsName,og.goodsUnit,og.goodsModel,og.goodsNum,og.goodsPrice,og.warehouseId,ps.owner,DATE_FORMAT(ps.orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,ps.vendorId from ordergoods_info as og,purchasestockin_info as ps where ps.id=og.orderId and orderId like '%CGRK%'`
    let sql2 = `select og.orderId,og.goodsId,og.goodsName,og.goodsUnit,og.goodsModel,og.goodsNum,og.goodsPrice,og.warehouseId,pr.owner,DATE_FORMAT(pr.orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,pr.vendorId from ordergoods_info as og,purchasereturn_info as pr where pr.id=og.orderId and orderId like '%CGTH%'`
    let where = '';
    if(!orderDate){
        orderDate = '本月'
    }
    (orderDate&&orderDate!=='全部'&&orderDate!=='自定义') && (where = db.andDate(where,'orderDate',orderDate));
    (approvalStatus&&approvalStatus!=='全部') && (where = db.and(where,'approvalStatus',approvalStatus));
    (vendorId&&vendorId!=='全部') && (where = db.and(where,'vendorId',vendorId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    (warehouseId&&warehouseId!=='全部') && (where = db.and(where,'warehouseId',warehouseId));
    (goodsName&&goodsName!=='全部') && (where = db.andLike(where,'goodsName',goodsName));
    if(where !== 'where'){
        sql1 = `${sql1} ${where}`
        sql2 = `${sql2} ${where}`
    }
    let sql = '';
    console.log('type',type)
    if(type=='采购入库'){
        sql = `${sql1}`
    }else if(type=='采购退货'){
        sql = `${sql2}`
    }else {
        sql = `${sql1} union all ${sql2}`
    }
    let countSql = `select count(*) as count from (${sql}) as a`
    const count = await db.querySql(countSql)
  
    sql = `select * from (${sql}) as a limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql);
    return {list,count: count[0].count,page,pageSize}
}


/*
select og.orderId,og.goodsId,og.goodsName,og.goodsUnit,og.goodsModel,og.goodsNum,og.goodsPrice,og.warehouseId,ps.owner,ps.orderDate,ps.vendorId
from 
ordergoods_info as og,purchasestockin_info as ps
where 
ps.id=og.orderId and orderId like '%CGRK%'
union all
select og.orderId,og.goodsId,og.goodsName,og.goodsUnit,og.goodsModel,og.goodsNum,og.goodsPrice,og.warehouseId,pr.owner,pr.orderDate,pr.vendorId
from 
ordergoods_info as og,purchasereturn_info as pr
where 
pr.id=og.orderId and orderId like '%CGTH%';

*/

// 销售明细报表
async function listSalesReport(query){
    debug && console.log(query)
    let {
        type, // 单据类型
        orderDate, // 单据日期
        apsrovalStatus, //审批状态
        customerId, // 客户
        owner, //销售人员
        goodsName, //商品名称
        warehouseId, //仓库
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql1 = `select og.orderId,og.goodsId,og.goodsName,og.goodsUnit,og.goodsModel,og.goodsNum,og.goodsPrice,og.warehouseId,s.owner,DATE_FORMAT(s.orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,s.customerId from ordergoods_info as og,sales_info as s where s.id=og.orderId and orderId like '%XSDD%'`
    let sql2 = `select og.orderId,og.goodsId,og.goodsName,og.goodsUnit,og.goodsModel,og.goodsNum,og.goodsPrice,og.warehouseId,sr.owner,DATE_FORMAT(sr.orderDate,'%Y-%m-%d %H:%i:%S') as orderDate,sr.customerId from ordergoods_info as og,salesreturn_info as sr where sr.id=og.orderId and orderId like '%XSTH%'`
    let where = '';
    if(!orderDate){
        orderDate = '本月'
    }
    (orderDate&&orderDate!=='全部'&&orderDate!=='自定义') && (where = db.andDate(where,'orderDate',orderDate));
    (apsrovalStatus&&apsrovalStatus!=='全部') && (where = db.and(where,'apsrovalStatus',apsrovalStatus));
    (customerId&&customerId!=='全部') && (where = db.and(where,'customerId',customerId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    (warehouseId&&warehouseId!=='全部') && (where = db.and(where,'warehouseId',warehouseId));
    (goodsName&&goodsName!=='全部') && (where = db.andLike(where,'goodsName',goodsName));
    if(where !== 'where'){
        sql1 = `${sql1} ${where}`
        sql2 = `${sql2} ${where}`
    }
    let sql = '';
    console.log('type',type)
    if(type=='销售单'){
        sql = `${sql1}`
    }else if(type=='销售退货'){
        sql = `${sql2}`
    }else {
        sql = `${sql1} union all ${sql2}`
    }
    let countSql = `select count(*) as count from (${sql}) as a`
    const count = await db.querySql(countSql)
  
    sql = `select * from (${sql}) as a limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql);
    return {list,count: count[0].count,page,pageSize}
}

// 利润报表
async function getProfitReport(query) {
    debug && console.log(query)
    let {
        orderDate, // 单据日期
    } = query;
    if(!orderDate){
        orderDate = '本月'
    }
    let where = 'where';
    (orderDate&&orderDate!=='全部'&&orderDate!=='自定义') && (where = db.andDate(where,'orderDate',orderDate));
    let sql1 = `select totalAmount from sales_info ${where} union all select totalAmount from salesreturn_info ${where}`
    let sql2 = `select totalAmount from purchasestockin_info ${where} union all select totalAmount from purchasereturn_info ${where}`
    let salesSql = `select sum(a.totalAmount) as sum from (${sql1}) as a`
    let purchaseSql = `select sum(a.totalAmount) as sum from (${sql2}) as a`
    const salesSum = await db.querySql(salesSql);
    const purchaseSum = await db.querySql(purchaseSql);
    
    return {sales: salesSum[0].sum,purchase: purchaseSum[0].sum}
}

module.exports = {
    listPurchaseReport,
    listSalesReport,
    getProfitReport
}