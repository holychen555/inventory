const db = require('../../db')
const _ = require('lodash')
const {debug} = require('../../utils/constant')
const { parseTime } = require("../../utils/index")
const { querySql,queryOne } = require('../../db')
// function exists(staffId){
//     const sql = `select * from staff_info where staffId='${staffId}'`;
//     return db.queryOne(sql)
// }
function login(staffAccount,staffPassword){
    const sql = `select * from staff_info where staffAccount='${staffAccount}' and staffPassword='${staffPassword}'`;
    return querySql(sql);
}

function findStaff(staffAccount){
    return queryOne(`select staffId,staffName,staffPermission,staffRole,staffPhone,staffAccount,createdDate from staff_info where staffAccount='${staffAccount}'`)
}

async function findStaffId(staffAccount){
    const data = await queryOne(`select staffId from staff_info where staffAccount='${staffAccount}'`);
    return data
}

async function listStaff(query){
    debug && console.log(query)
    const {
        staffName,
        staffId,
        staffRole,
        page = 1,
        pageSize = 10
    } = query
    const offset =  (page-1) * pageSize
    let sql = `select staffId,staffName,staffPermission,staffRole,staffPhone,staffAccount,staffPassword,DATE_FORMAT(createdDate,'%Y-%m-%d %H:%i:%S') as createdDate from staff_info`
    let where = 'where';
    (staffRole&&staffRole!=='全部') && (where = db.and(where,'staffRole',staffRole));
    staffId && (where = db.andLike(where,'staffId',staffId));
    staffName && (where = db.andLike(where,'staffName',staffName));
    if(where !== 'where'){
        sql = `${sql} ${where}`
    }
    let countSql = `select count(*) as count from  staff_info`
    if(where !== 'where'){
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count: count[0].count,page,pageSize}

}

async function getAllStaff(){
    let sql = `select staffId as value,staffName as label from staff_info`
    const list = await db.querySql(sql)
    return {list}
}

function addStaff(query){
    debug && console.log(query)
    const {
        staffName,
        staffPhone,
        staffPermission,
        staffPassword,
        staffAccount,
        staffRole
    } = query
    return new Promise(async (resolve, reject) => {
        try {
            if(!staffName){
                reject(new Error('用户名称不能为空'));
                return
            }
            if(!staffRole){
                reject(new Error('用户角色不能为空'));
                return
            }
            if(!staffPassword){
                reject(new Error('用户账号不能为空'));
                return
            }
            if(!staffAccount){
                reject(new Error('用户密码不能为空'));
                return
            }
            const staffId = await db.incrementId('staff_info','staffId','YH',8);
            const staffObj = {
                staffId,
                staffName,
                staffPhone,
                staffPermission,
                staffPassword,
                staffAccount,
                staffRole,
                createdDate: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')
            }
            await db.insert(staffObj, 'staff_info');
            resolve(true)
            
        } catch (e) {
            reject(e)
        }
    })
}

function updateStaff(query){
    debug && console.log(query)
    const {
        staffId,
        staffName,
        staffPhone,
        staffPermission,
        staffPassword,
        staffAccount,
        staffRole
    } = query
    return new Promise(async (resolve,reject)=>{
        try{
            if(!staffName){
                reject(new Error('用户名称不能为空'));
                return
            }
            if(!staffRole){
                reject(new Error('用户角色不能为空'));
                return
            }
            if(!staffPassword){
                reject(new Error('用户账号不能为空'));
                return
            }
            if(!staffAccount){
                reject(new Error('用户密码不能为空'));
                return
            }
            const staffObj = {
                staffId,
                staffName,
                staffPhone,
                staffPermission,
                staffPassword,
                staffAccount,
                staffRole
            }
            await db.update(staffObj,'staff_info',`where staffId='${staffId}'`)
            resolve(true)
        }catch(e){
            reject(e)
        }
    })
}

function deleteStaff(staff){
    return new Promise(async (resolve,reject)=>{
        if(!staff){
            await reject(new Error('用户id不能为空'));
            return
        }
        const sql = `delete from staff_info where staffId in (${staff})`
        db.querySql(sql).then(()=>{
            resolve(true)
        })
    })
}
module.exports ={
    login,
    findStaff,
    listStaff,
    addStaff,
    updateStaff,
    deleteStaff,
    getAllStaff,
    findStaffId
}
