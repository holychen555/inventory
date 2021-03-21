
const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
const { decoded } = require('../../utils/index');
const {findStaffId} = require('../base/staff')
// 盘点单
async function getCheckId() {
    const id = await db.incrementId('check_info','id','KCPD',16,true);
    return id;
}
function addCheck(req){
    debug && console.log(req.query)
    const {
        id,
        checkDate,
        warehouseId,
        checkNum,
        profitAndLoss
    } = req.query
    const decode = decoded(req);
   
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('盘点单编号不能为空'));
                return
            }
            if(!checkDate){
                reject(new Error('交货日期不能为空'));
                return
            }
            if(!warehouseId){
                reject(new Error('仓库不能为空'));
                return
            }
            if(!checkNum){
                reject(new Error('盘点产品数不能为空'));
                return
            }
            if(!profitAndLoss){
                reject(new Error('盘亏盘盈不能为空'))
            }
           
            const {staffId} = await findStaffId(decode && decode.staffAccount);
            const checkObj = {
                id,
                owner: staffId,
                checkDate,
                warehouseId,
                checkNum,
                profitAndLoss,
                createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                createdBy: staffId,
            }
            await db.insert(checkObj, 'check_info');
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
async function listCheck(query){
    debug && console.log(query)
    let {
        checkDate, //交货日期
        approvalStatus, //审批状态
        warehouseId, // 仓库
        owner, //盘点人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select id,owner,DATE_FORMAT(checkDate,'%Y-%m-%d %H:%i:%S') as checkDate,warehouseId,approvalStatus,approvalBy,createdBy,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,checkNum,profitAndLoss from check_info`
    let where = 'where';
    if(!checkDate){
        checkDate = '本月'
    }
    (checkDate&&checkDate!=='全部'&&checkDate!=='自定义') && (where = db.andDate(where,'checkDate',checkDate));
    (approvalStatus&&approvalStatus!=='全部') && (where = db.and(where,'approvalStatus',approvalStatus));
    (warehouseId&&warehouseId!=='全部') && (where = db.and(where,'warehouseId',warehouseId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from check_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}
}

function deleteCheck(id){
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('盘点单不能为空'));
            return
        }
        const sql = `delete from check_info where id='${id}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function getCheckById(id) {
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('盘点单编号不能为空'));
            return
        }
        const sql = `select id,owner,approvalMsg,DATE_FORMAT(approvalDate,'%Y-%m-%d %H:%i:%S') as approvalDate,DATE_FORMAT(checkDate,'%Y-%m-%d %H:%i:%S') as checkDate,warehouseId,approvalStatus,approvalBy,createdBy,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,checkNum,profitAndLoss from check_info where id='${id}'`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updateCheck(query){
    debug && console.log(query)
    const {
        id,
        profitAndLoss
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('盘点单编号不能为空'));
                return
            }
            if(!profitAndLoss){
                reject(new Error('盘亏盘盈不能为空'))
            }
        
            const checkObj = {
                id,
                profitAndLoss,
                approvalStatus: 0
            }
            await db.update(checkObj,'check_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function updateCheckApproval(req){
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
            const checkObj = {
                approvalStatus,
                approvalMsg,
                approvalBy: staffId,
                approvalDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(checkObj,'check_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    listCheck,
    deleteCheck,
    getCheckId,
    addCheck,
    getCheckById,
    updateCheck,
    updateCheckApproval,

}