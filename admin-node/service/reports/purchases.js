const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')

async function listPurchaseReport(query){
    debug && console.log(query)
    let {
        orderDate, // 单据日期
        deliveryDate, //交货日期
        approvalStatus, //审批状态
        vendorId, // 供应商
        owner, //采购人员
        goodsName, //商品名称
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql1 = `select og.orderId,og.goodsId,og.goodsName,og.goodsUnit,og.goodsModel,og.goodsNum,og.goodsPrice,og.warehouseId,ps.owner,ps.orderDate,ps.vendorId from ordergoods_info as og,purchasestockin_info as ps`
    let sql2 = `select og.orderId,og.goodsId,og.goodsName,og.goodsUnit,og.goodsModel,og.goodsNum,og.goodsPrice,og.warehouseId,pr.owner,pr.orderDate,pr.vendorId from ordergoods_info as og,purchasereturn_info as pr`
    let where = 'where';
    if(!orderDate){
        orderDate = '本月'
    }
    (orderDate&&orderDate!=='全部'&&orderDate!=='自定义') && (where = db.andDate(where,'orderDate',orderDate));
    (deliveryDate&&deliveryDate!=='全部'&&deliveryDate!=='自定义') && (where = db.andDate(where,'deliveryDate',deliveryDate));
    (approvalStatus&&approvalStatus!=='全部') && (where = db.and(where,'approvalStatus',approvalStatus));
    (vendorId&&vendorId!=='全部') && (where = db.and(where,'vendorId',vendorId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    (goodsName&&goodsName!=='全部') && (where = db.andLike(where,'goodsName',goodsName));
    if(where !== 'where'){
        sql1 = `${sql1} ${where}`
        sql2 = `${sql2} ${where}`
    }
 
    let sql = `${sql1} union all ${sql2}`
    const list = await db.querySql(sql)
    return {list}
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

module.exports = {
    listPurchaseReport
}