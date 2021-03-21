
// const Book = require('../models/Book')
const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
const { decoded } = require('../../utils/index');
const {findStaffId} = require('../base/staff')
// 预入库单
async function getPreStockinId() {
    const id = await db.incrementId('prestockin_info','id','YRKD',16,true);
    return id;
}
function addPreStockin(req){
    debug && console.log(req.query)
    const {
        id,
        owner,
        arrivalDate,
        vendorId,
        relatedFromId,
    } = req.query
    const decode = decoded(req);
   
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('预入库单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('采购人员不能为空'));
                return
            }
            if(!arrivalDate){
                reject(new Error('到货日期不能为空'));
                return
            }
            if(!vendorId){
                reject(new Error('供应商不能为空'));
                return
            }
            const {staffId} = await findStaffId(decode && decode.staffAccount);
            const prestockinObj = {
                id,
                owner,
                arrivalDate,
                vendorId,
                createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
                createdBy: staffId,
                relatedFromId 
            }
            await db.insert(prestockinObj, 'prestockin_info');
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}
async function listPreStockin(query){
    debug && console.log(query)
    let {
        arrivalDate, //到货日期
        approvalStatus, //审批状态
        vendorId, // 供应商
        owner, //采购人员
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select id,owner,DATE_FORMAT(arrivalDate,'%Y-%m-%d %H:%i:%S') as arrivalDate,vendorId,approvalStatus,approvalBy,relatedFromId,relatedToId from prestockin_info`
    let where = 'where';
    if(!arrivalDate){
        arrivalDate = '本月'
    }
    (arrivalDate&&arrivalDate!=='全部'&&arrivalDate!=='自定义') && (where = db.andDate(where,'arrivalDate',arrivalDate));
    (approvalStatus&&approvalStatus!=='全部') && (where = db.and(where,'approvalStatus',approvalStatus));
    (vendorId&&vendorId!=='全部') && (where = db.and(where,'vendorId',vendorId));
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from prestockin_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}
}

function deletePreStockin(id){
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('预入库单不能为空'));
            return
        }
        const sql = `delete from prestockin_info where id='${id}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function getPreStockinById(id) {
    return new Promise(async (resolve,reject)=>{
        if(!id){
            await reject(new Error('预入库单编号不能为空'));
            return
        }
        const sql = `select id,vendorId,approvalStatus,approvalMsg,owner,DATE_FORMAT(arrivalDate,'%Y-%m-%d %H:%i:%S') as arrivalDate,DATE_FORMAT(approvalDate,'%Y-%m-%d %H:%i:%S') as approvalDate,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate,approvalBy,createdBy from prestockin_info where id='${id}'`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updatePreStockin(query){
    debug && console.log(query)
    const {
        id,
        owner,
        arrivalDate,
        vendorId
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!id){
                reject(new Error('预入库单编号不能为空'));
                return
            }
            if(!owner){
                reject(new Error('采购人员不能为空'));
                return
            }
            if(!arrivalDate){
                reject(new Error('到货日期不能为空'));
                return
            }
            if(!vendorId){
                reject(new Error('供应商不能为空'));
                return
            }
            const prestockinObj = {
                id,
                owner,
                arrivalDate,
                vendorId,
                approvalStatus: 0
            }
            await db.update(prestockinObj,'prestockin_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function updatePreStockinApproval(req){
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
            const prestockinObj = {
                approvalStatus,
                approvalMsg,
                approvalBy: staffId,
                approvalDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}'),
            }
            await db.update(prestockinObj,'prestockin_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    listPreStockin,
    deletePreStockin,
    getPreStockinId,
    addPreStockin,
    getPreStockinById,
    updatePreStockin,
    updatePreStockinApproval,

}