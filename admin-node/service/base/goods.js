const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
// 商品分类
function exists(category){
    const name = category;
    const sql = `select * from goods_category where categoryName='${name}'`;
    return db.queryOne(sql)
}

async function getGoodsCategory(){
    const sql = `select categoryId,categoryName from goods_category`;
    const result = await db.querySql(sql);
    const categoryList = []
    result.forEach(item=>{
        categoryList.push({
            id: item.categoryId,
            key:item.categoryId,
            label: item.categoryName
        })
    })
    return categoryList;
}

function addGoodsCategory(category){
    return new Promise(async (resolve, reject) => {
        try {
            if(!category){
                reject(new Error('分类名称不能为空'));
                return
            }
            const result = await exists(category);
            if (result) {
                reject(new Error('新增分类不可与其他分类同名'));
                return
            } else {
                const categoryObj = {
                    categoryName: category,
                    createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')
                }
                await db.insert(categoryObj, 'goods_category');
                resolve(true)
            }
        } catch (e) {
            reject(e)
        }
    })
}

function updateGoodsCategory(category){
    return new Promise(async (resolve,reject)=>{
        try{
            if(!category.categoryName){
                await reject(new Error('分类名称不能为空'));
                return
            }
            const categoryObj = {
                categoryName: category.categoryName
            }
            const result = await exists(category);
            if (result.length==2) {
                reject(new Error('分类不可与其他分类同名'));
                return
            } else {
                await db.update(categoryObj,'goods_category',`where categoryId=${category.categoryId}`)
                resolve(true)
            }
        }catch(e){
            reject(e)
        }
    })
}

function deleteGoodsCategory(category){
    return new Promise(async (resolve,reject)=>{
        if(!category){
            await reject(new Error('分类名称不能为空'));
            return
        }
        const sql = `delete from goods_category where categoryName = '${category}'`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}
// 商品
async function listGoods(query){
    debug && console.log(query)
    const {
        goodsName,
        goodsId,
        goodsModel,
        goodsCategory,
        categoryName,
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select goodsId,goodsName,goodsUnit,goodsModel,beginingNum,sellingPrice,buyingPrice,goodsCategory,goodsDisabled,maxStock,minStock,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate from goods_info`
    let where = 'where';
    (categoryName&&categoryName!='全部') && (where = db.and(where,'goodsCategory',categoryName));
    goodsId && (where = db.andLike(where,'goodsId',goodsId));
    goodsName && (where = db.andLike(where,'goodsName',goodsName));
    goodsModel && (where = db.andLike(where,'goodsModel',goodsModel));
    goodsCategory && (where = db.andLike(where,'goodsCategory',goodsCategory));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from goods_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
  
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}

}


function deleteGoods(goods){
    return new Promise(async (resolve,reject)=>{
        if(!goods){
            await reject(new Error('商品id不能为空'));
            return
        }
        const sql = `delete from goods_info where goodsId in (${goods})`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}

function addGoods(query){
    debug && console.log(query)
    const {
        goodsName,
        goodsUnit,
        goodsModel,
        sellingPrice,
        buyingPrice,
        goodsCategory,
        maxStock,
        minStock,
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!goodsName){
                reject(new Error('商品名称不能为空'));
                return
            }
            const result = await exists(goodsName);
            if (result) {
                reject(new Error('新增商品不可与其他商品同名'));
                return
            } else {
                const goodsId = await db.incrementId('goods_info','goodsId','SP',8);
                const goodsObj = {
                    goodsId,
                    goodsName,
                    goodsUnit,
                    goodsModel,
                    sellingPrice,
                    buyingPrice,
                    goodsCategory,
                    maxStock,
                    minStock,
                    createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')
                }
                await db.insert(goodsObj, 'goods_info');
                resolve(true)
            }
        } catch (e) {
            reject(e)
        }
    })
}

function getGoodsById(goodsId) {
    return new Promise(async (resolve,reject)=>{
        if(!goodsId){
            await reject(new Error('商品id不能为空'));
            return
        }
        const sql = `select * from goods_info where goodsId='${goodsId}' limit 0,1`
        const data = await db.querySql(sql);
        resolve(data[0]);
    })
}

function updateGoods(query){
    debug && console.log(query)
    const {
        goodsId,
        goodsName,
        goodsUnit,
        goodsModel,
        sellingPrice,
        buyingPrice,
        goodsCategory,
        maxStock,
        minStock,
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!goodsName){
                reject(new Error('商品名称不能为空'));
                return
            }
            const goodsObj = {
                goodsName,
                goodsUnit,
                goodsModel,
                sellingPrice,
                buyingPrice,
                goodsCategory,
                maxStock,
                minStock,
            }
            await db.update(goodsObj,'goods_info',`where goodsId='${goodsId}'`);
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function toggleGoodsDisabled(query){
    debug && console.log(query)
    const {
        goodsDisabled,
        goodsId
    } = query;
    return new Promise(async (resolve,reject)=>{
        try{
            const goodsObj = {
                goodsDisabled: goodsDisabled=='true'?1:0
            }
            await db.update(goodsObj,'goods_info',`where goodsId='${goodsId}'`);
            resolve(goodsDisabled=='true'?'禁用':'启用');
        }catch(e){
            reject(e)
        }
    })
}

function getGoodsByName(goodsName) {
    return new Promise(async (resolve,reject)=>{
        if(!goodsName){
            await reject(new Error('商品名称不能为空'));
            return
        }
        let sql = `select goodsId as value,goodsName as label from goods_info`
        let where = 'where';
        goodsName && (where = db.andLike(where,'goodsName',goodsName));
        if(where !== 'where'){
            sql = `${sql} ${where}`
        }
        const data = await db.querySql(sql);
        resolve(data);
    })
}
module.exports ={
    getGoodsCategory,
    addGoodsCategory,
    updateGoodsCategory,
    deleteGoodsCategory,
    listGoods,
    deleteGoods,
    addGoods,
    getGoodsById,
    updateGoods,
    toggleGoodsDisabled,
    getGoodsByName
}
