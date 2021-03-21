
// const Book = require('../models/Book')
const db = require('../db')
const _ = require('lodash')
const {debug} = require('../utils/constant')
// const { parseTime } = require("../utils/index")
// function exists(vendorName) {
//     const sql = `select * from vendor_info where vendorName='${vendorName}'`
//     return db.queryOne(sql)
// }
function addOrderGoodsList(data){
    let list = data.list;
    let orderId = data.orderId;
    console.log(list,orderId);
    return new Promise((resolve, reject) => {
        try {
            if(!orderId){
                reject(new Error('相关单据不能为空'));
                return
            }
            if(Array.isArray(list)){
                list.forEach(async item => {
                    item.orderId = orderId;
                    await addOrderGoods(item);
                })
                resolve(true)
            }
           
        } catch (e) {
            reject(e)
        }
    })
}

function addOrderGoods(query){
    debug && console.log(query)
    const {
        orderId,
        goodsId,
        goodsName,
        goodsUnit,
        goodsModel,
        goodsNum,
        goodsPrice,
        warehouseId,
        msg
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!orderId){
                reject(new Error('相关单据不能为空'));
                return
            }
            if(!goodsId){
                reject(new Error('商品编号不能为空'));
                return
            }
            if(!goodsName){
                reject(new Error('商品名称不能为空'));
                return
            }
            if(!goodsUnit){
                reject(new Error('商品单位不能为空'));
                return
            }
            if(!goodsNum){
                reject(new Error('数量不能为空'));
                return
            }
            if(goodsPrice == null){
                reject(new Error('价格不能为空'));
                return
            }
            if(!warehouseId){
                reject(new Error('仓库不能为空'));
                return
            }
            const ordergoodsObj = {
                orderId,
                goodsId,
                goodsName,
                goodsUnit,
                goodsNum,
                goodsPrice,
                warehouseId,
                msg,
                goodsModel
            }
            await db.insert(ordergoodsObj, 'ordergoods_info');
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}


async function getOrderGoods(orderId){
    if(orderId){
        let sql = `select * from ordergoods_info where orderId='${orderId}'`;
        const list = await db.querySql(sql)
        return {list}; 
    }
}


function deleteOrderGoods(orderId){
    return new Promise(async (resolve,reject)=>{
        if(!orderId){
            await reject(new Error('单据编号不能为空'));
            return
        }
        const sql = `delete from ordergoods_info where orderId='${orderId}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function updateOrderGoodsList(data){
    let list = data.list;
    return new Promise((resolve, reject) => {
        try {
            if(Array.isArray(list)){
                list.forEach(async item => {
                    await updateOrderGoods(item);
                })
                resolve(true)
            }
           
        } catch (e) {
            reject(e)
        }
    })
}


function updateOrderGoods(query){
    debug && console.log(query)
    const {
        id,
        orderId,
        goodsId,
        goodsName,
        goodsUnit,
        goodsNum,
        goodsPrice,
        warehouseId,
        msg,
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!orderId){
                reject(new Error('相关单据不能为空'));
                return
            }
            if(!goodsId){
                reject(new Error('商品编号不能为空'));
                return
            }
            if(!goodsName){
                reject(new Error('商品名称不能为空'));
                return
            }
            if(!goodsUnit){
                reject(new Error('商品单位不能为空'));
                return
            }
            if(!goodsNum){
                reject(new Error('数量不能为空'));
                return
            }
            if(!goodsPrice){
                reject(new Error('价格不能为空'));
                return
            }
            if(!warehouseId){
                reject(new Error('仓库不能为空'));
                return
            }
            const ordergoodsObj = {
                orderId,
                goodsId,
                goodsName,
                goodsUnit,
                goodsNum,
                goodsPrice,
                warehouseId,
                msg
            }
            await db.update(ordergoodsObj,'ordergoods_info',`where id='${id}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getOrderGoods,
    deleteOrderGoods,
    addOrderGoods,
    updateOrderGoods,
    addOrderGoodsList,
    updateOrderGoodsList
}