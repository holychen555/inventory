const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")

function exists(name){
    const sql = `select * from warehouse_info where warehouseName='${name}'`;
    return db.queryOne(sql)
}

async function listWareHouse(query){
    debug && console.log(query)
    const {
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select warehouseId,warehouseName,owner,warehouseAddress,msg,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate from warehouse_info`
    let countSql = `select count(*) as count from  warehouse_info`
    const count = await db.querySql(countSql)
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}

}

async function getAllWareHouse(){
    let sql = `select warehouseId as value,warehouseName as label from warehouse_info`
    const list = await db.querySql(sql)
    return {list}
}

function addWareHouse(query){
    debug && console.log(query)
    const {
        warehouseName,
        warehouseAddress,
        owner,
        msg
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!warehouseName){
                reject(new Error('仓库名称不能为空'));
                return
            }
            if(!owner){
                reject(new Error('负责人不能为空'));
                return
            }
            const result = await exists(warehouseName);
            if (result) {
                reject(new Error('新增仓库不可与其他仓库同名'));
                return
            } else {
                const warehouseId = await db.incrementId('warehouse_info','warehouseId','CK',8);
                const warehouseObj = {
                    warehouseId,
                    warehouseName,
                    warehouseAddress,
                    owner,
                    msg,
                    createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')
                }
                await db.insert(warehouseObj, 'warehouse_info');
                resolve(true)
            }
        } catch (e) {
            reject(e)
        }
    })
}

function updateWareHouse(query){
    debug && console.log(query)
    const {
        warehouseId,
        warehouseName,
        warehouseAddress,
        owner,
        msg
    } = query
    return new Promise(async (resolve,reject)=>{
        try{
            if(!warehouseName){
                reject(new Error('仓库名称不能为空'));
                return
            }
            if(!owner){
                reject(new Error('负责人不能为空'));
                return
            }
            const warehouseObj = {
                warehouseId,
                warehouseName,
                warehouseAddress,
                owner,
                msg
            }
            await db.update(warehouseObj,'warehouse_info',`where warehouseId='${warehouseId}'`)
            resolve(true)
        }catch(e){
            reject(e)
        }
    })
}

function deleteWareHouse(warehouseId){
    return new Promise(async (resolve,reject)=>{
        if(!warehouseId){
            await reject(new Error('仓库Id不能为空'));
            return
        }

        const sql = `delete from warehouse_info where warehouseId = '${warehouseId}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

module.exports ={
    listWareHouse,
    addWareHouse,
    updateWareHouse,
    deleteWareHouse,
    getAllWareHouse
}
