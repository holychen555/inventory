
// const Book = require('../models/Book')
const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
function exists(customerName) {
    const sql = `select * from customer_info where customerName='${customerName}'`
    return db.queryOne(sql)
}

async function listCustomer(query){
    debug && console.log(query)
    const {
        customerName,
        customerType,
        owner,
        customerId,
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select customerId,customerName,owner,contactName,customerType,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate from customer_info`
    let where = 'where';
    (owner&&owner!=='全部') && (where = db.and(where,'owner',owner));
    (customerType&&customerType!=='全部') && (where = db.and(where,'customerType',customerType));
    customerId && (where = db.andLike(where,'customerId',customerId));
    customerName && (where = db.andLike(where,'customerName',customerName));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from customer_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}

}

async function getAllCustomerByName(query){
    const {customerName} = query;
    let sql = `select customerId as value,customerName as label,recipientName,recipientPhone,recipientAddress from customer_info`
    let where = 'where';
    customerName && (where = db.andLike(where,'customerName',customerName));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    const list = await db.querySql(sql)
    return {list}
}

function deleteCustomer(customer){
    return new Promise(async (resolve,reject)=>{
        if(!customer){
            await reject(new Error('客户id不能为空'));
            return
        }
        const sql = `delete from customer_info where customerId in (${customer})`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function addCustomer(query){
    debug && console.log(query)
    const {
        customerName,
        customerType,
        owner,
        contactName,
        contactPhone,
        recipientName,
        recipientPhone,
        recipientAddress
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!customerName){
                reject(new Error('客户名称不能为空'));
                return
            }
            if(customerType == undefined){
                reject(new Error('客户类型不能为空'));
                return
            }
            if(!owner){
                reject(new Error('业务员不能为空'));
                return
            }
            const result = await exists(customerName);
            if (result) {
                reject(new Error('新增客户不可与其他客户同名'));
                return
            } else {
                const customerId = await db.incrementId('customer_info','customerId','KH',8);
                const customerObj = {
                    customerName,
                    customerType,
                    owner,
                    contactName,
                    contactPhone,
                    recipientName,
                    recipientPhone,
                    recipientAddress,
                    customerId,
                    createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')
                }
                await db.insert(customerObj, 'customer_info');
                resolve(true)
            }
        } catch (e) {
            reject(e)
        }
    })
}

function getCustomerById(customerId) {
    return new Promise(async (resolve,reject)=>{
        if(!customerId){
            await reject(new Error('客户id不能为空'));
            return
        }
        const sql = `select * from customer_info where customerId='${customerId}' limit 0,1`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updateCustomer(query){
    debug && console.log(query)
    const {
        customerId,
        customerName,
        customerType,
        owner,
        contactName,
        contactPhone,
        recipientName,
        recipientPhone,
        recipientAddress
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!customerName){
                reject(new Error('客户名称不能为空'));
                return
            }
            if(customerType == undefined){
                reject(new Error('客户类型不能为空'));
                return
            }
            if(!owner){
                reject(new Error('业务员不能为空'));
                return
            }
            const customerObj = {
                customerName,
                customerType,
                owner,
                contactName,
                contactPhone,
                recipientName,
                recipientPhone,
                recipientAddress
            }
            await db.update(customerObj,'customer_info',`where customerId='${customerId}'`);
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    listCustomer,
    deleteCustomer,
    addCustomer,
    getCustomerById,
    updateCustomer,
    getAllCustomerByName
}