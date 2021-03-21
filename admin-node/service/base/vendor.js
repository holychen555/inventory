
// const Book = require('../models/Book')
const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
function exists(vendorName) {
    const sql = `select * from vendor_info where vendorName='${vendorName}'`
    return db.queryOne(sql)
}

async function listVendor(query){
    debug && console.log(query)
    const {
        vendorName,
        vendorType,
        owner,
        vendorId,
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select vendorId,vendorName,owner,contactName,vendorType,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate from vendor_info`
    let where = 'where';
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    (vendorType&&vendorType!=='全部') && (where = db.and(where,'vendorType',vendorType));
    vendorId && (where = db.andLike(where,'vendorId',vendorId));
    vendorName && (where = db.andLike(where,'vendorName',vendorName));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from vendor_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}

}

async function getAllVendorByName(query){
    const {vendorName} = query;
    let sql = `select vendorId as value,vendorName as label from vendor_info`
    let where = 'where';
    vendorName && (where = db.andLike(where,'vendorName',vendorName));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    const list = await db.querySql(sql)
    return {list}
}

function deleteVendor(vendor){
    return new Promise(async (resolve,reject)=>{
        if(!vendor){
            await reject(new Error('供应商id不能为空'));
            return
        }
        const sql = `delete from vendor_info where vendorId in (${vendor})`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function addVendor(query){
    debug && console.log(query)
    const {
        vendorName,
        vendorType,
        owner,
        contactName,
        contactPhone,
        vendorAddress
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!vendorName){
                reject(new Error('供应商名称不能为空'));
                return
            }
            if(vendorType == undefined){
                reject(new Error('供应商类型不能为空'));
                return
            }
            if(!owner){
                reject(new Error('负责人不能为空'));
                return
            }
            const result = await exists(vendorName);
            if (result) {
                reject(new Error('新增供应商不可与其他供应商同名'));
                return
            } else {
                const vendorId = await db.incrementId('vendor_info','vendorId','GYS',8);
                const vendorObj = {
                    vendorName,
                    vendorType,
                    owner,
                    contactName,
                    contactPhone,
                    vendorAddress,
                    vendorId,
                    createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')
                }
                await db.insert(vendorObj, 'vendor_info');
                resolve(true)
            }
        } catch (e) {
            reject(e)
        }
    })
}

function getVendorById(vendorId) {
    return new Promise(async (resolve,reject)=>{
        if(!vendorId){
            await reject(new Error('供应商id不能为空'));
            return
        }
        const sql = `select * from vendor_info where vendorId='${vendorId}' limit 0,1`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updateVendor(query){
    debug && console.log(query)
    const {
        vendorId,
        vendorName,
        vendorType,
        owner,
        contactName,
        contactPhone,
        vendorAddress
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!vendorName){
                reject(new Error('供应商名称不能为空'));
                return
            }
            if(vendorType == undefined){
                reject(new Error('供应商类型不能为空'));
                return
            }
            if(!owner){
                reject(new Error('负责人不能为空'));
                return
            }
            const vendorObj = {
                vendorName,
                vendorType,
                owner,
                contactName,
                contactPhone,
                vendorAddress
            }
            await db.update(vendorObj,'vendor_info',`where vendorId='${vendorId}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    listVendor,
    deleteVendor,
    addVendor,
    getVendorById,
    updateVendor,
    getAllVendorByName
}