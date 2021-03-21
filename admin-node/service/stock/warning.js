const db = require('../../db');
const _ = require('lodash');
// const { parseTime } = require("../../utils/index")
const {debug} = require('../../utils/constant');

// select g.goodsId,g.goodsName,g.goodsUnit,g.goodsModel,g.goodsCategory,g.goodsDisabled,g.maxStock,g.minStock,sum(gs.currentNum) as currentNum from goods_info as g,goodsstock_info gs where g.goodsId=gs.goodsId group by g.goodsId;

async function listGoodsStock(query){
    debug && console.log(query)
    const {
        type,
        goodsId,
        warehouseId,
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select g.goodsId,g.goodsName,g.goodsUnit,g.goodsModel,g.goodsCategory,g.goodsDisabled,g.maxStock,g.minStock,gs.currentNum,gs.warehouseId from goods_info as g,goodsstock_info gs`
    let where = 'where g.goodsId=gs.goodsId';
    if(type=='高库存'){
        where += ` and g.maxStock<gs.currentNum`;
    }else if(type=='低库存'){
        where += ` and g.minStock>gs.currentNum`;
    }
    (goodsId&&goodsId!='全部') && (where += ` and gs.goodsId='${goodsId}'`);
    (warehouseId&&warehouseId!='全部') && (where += ` and gs.warehouseId='${warehouseId}'`);

    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from goods_info as g,goodsstock_info gs`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}

}

module.exports = {
    listGoodsStock
}