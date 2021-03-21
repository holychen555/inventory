const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
const { decoded } = require('../../utils/index');
const {findStaffId} = require('../base/staff')

async function listSalesRecord(query){
    debug && console.log(query)
    let {
        orderDate, //单据日期
        owner, //销售人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select n.owner,sum(if(n.id like '%XSDD%',n.totalAmount,0)) as xsAmount,sum(if(n.id like '%XSTH%',n.totalAmount,0)) as thAmount, sum(if(n.id like '%XSDD%',1,0)) as xsNum,sum(if(n.id like '%XSTH%',1,0)) as thNum`
    let sql1 = `select id,totalAmount,owner from salesreturn_info`;
    let sql2 = `select id,totalAmount,owner from sales_info`;
    let where = 'where';
    if(!orderDate){
        orderDate = '本周'
    }
    (orderDate&&orderDate!=='全部'&&orderDate!=='自定义') && (where = db.andDate(where,'orderDate',orderDate));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql1 = `${sql1} ${where}`
        sql2 = `${sql2} ${where}`
    }
    sql = `${sql} from (${sql1} union all ${sql2}) as n group by n.owner`;
    const list = await db.querySql(sql)
    return {list}
}
/*
select n.owner,sum(if(n.id like '%XSDD%',n.totalAmount,0)) as xsAmount,sum(if(n.id like '%XSTH%',n.totalAmount,0)) as thAmount, sum(if(n.id like '%XSDD%',1,0)) as xsNum,sum(if(n.id like '%XSTH%',1,0)) as thNum 
from 
(select id,totalAmount,owner
from salesreturn_info 
-- where 'owner'='YH000004'
union all 
select id,totalAmount,owner
from sales_info ) as n
group by n.owner;
*/

module.exports = {
    listSalesRecord
};