const mysql = require('mysql')
const config = require('./config')
const debug = require('../utils/constant').debug
const {isObject,padding,parseTime} = require('../utils/index')
function connect() {
    return mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        multipleStatements: true
    })
}

function querySql(sql) {
    const conn = connect()
    debug && console.log(sql)
    return new Promise((resolve, reject) => {
        try {
            conn.query(sql, (err, results) => {
                if (err) {
                    debug && console.log('查询失败，原因:' + JSON.stringify(err))
                    reject(err)
                } else {
                    debug && console.log('查询成功' + JSON.stringify(results))
                    resolve(results)
                }
            })
        } catch (e) {
            reject(e)
        } finally {
            conn.end()
        }
    })
}
/**
 * sql 找到某张表中最大ID的数据
 * Id 需要自增的ID
 * tag ID中的标识，可用来切割
 * len 字段长度
 * timeStamp ID中是否含有时间数据
 */
function incrementId(tableName,Id,tag,len,timeStamp) {
    return new Promise((resolve, reject) => {
        let sql = `select ${Id} from ${tableName}`;
        let where = 'where';
        timeStamp && (where = andLike(where, Id, tag+parseTime(new Date,'{y}{m}{d}')));
        if(where !== 'where'){
            sql = `${sql} ${where}`
        }
        sql = sql + ` order by ${Id} desc limit 0,1`
        querySql(sql).then(result => {
            if(result.length==0){
                if(timeStamp){
                    result = tag + parseTime(new Date,'{y}{m}{d}') + '0001';
                    resolve(result);
                }
                const tagLen = tag.length;
                result = tag + padding(1,len-tagLen);
                resolve(result);
            }else{
                result = result[0][Id];
                if(timeStamp){
                    result = tag + parseTime(new Date,'{y}{m}{d}') + padding(+result.slice(12)+1,4);
                    resolve(result);
                }
                const length = result.length;
                const tagLen = tag.length;
                result = tag + padding(+result.slice(tagLen)+1,length-tagLen);
                resolve(result);
            }
           
            
        }).catch(err => {
            reject(err)
        })
    })
}

function queryOne(sql) {
    return new Promise((resolve, reject) => {
        querySql(sql).then(results => {
            if (results && results.length > 0) {
                resolve(results[0])
            } else {
                resolve(null)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

function insert(model, tableName) {
    return new Promise((resolve, reject) => {
        // console.log(model);
        if (!isObject(model)) {
            reject(new Error('添加的数据不合法'))
        } else {
            const keys = []
            const values = []
            Object.keys(model).forEach(key => {
                if (model.hasOwnProperty(key)) {
                    keys.push(`\`${key}\``)
                    values.push(`'${model[key]}'`)
                }
            })
            if (keys.length > 0 && values.length > 0) {
                let sql = `insert into \`${tableName}\`(`
                const keysString = keys.join(',')
                const valuesString = values.join(',')
                sql = `${sql}${keysString}) values (${valuesString})`
                debug && console.log(sql)
                const conn = connect()
                try {
                    conn.query(sql, (err, result) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(result)
                        }
                    })
                } catch (e) {
                    reject(e)
                } finally {
                    conn.end()
                }
            } else {
                reject(new Error('插入对象失败，对象中没有任何属性'))
            }
        }
    })
}

function update(model,tableName,where){
    return new Promise((resolve,reject)=>{
        if(!isObject(model)){
            reject(new Error('添加的数据不合法'))
        }else{
            const entry = []
            Object.keys(model).forEach(key=>{
                if(model.hasOwnProperty(key)){
                    entry.push(`\`${key}\`='${model[key]}'`)
                }
            })
            if(entry.length>0){
                let sql = `update \`${tableName}\` set`
                sql = `${sql} ${entry.join(',')} ${where}`
                debug && console.log(sql)
                const conn = connect()
                try{
                    conn.query(sql,(err,result)=>{
                        if(err){
                            reject(err)
                        }else{
                            resolve(result)
                        }
                    })
                }catch(e){
                    reject(e)
                }finally{
                    conn.end();
                }
            }
        }
    })
}

function and(where,k,v){
    if(where == 'where'){
        return `${where} \`${k}\`='${v}'`
    }else{
        return `${where} and \`${k}\`='${v}'`
    }
}

function andLike(where,k,v){
    if(where == 'where'){
        return `${where} \`${k}\` like '%${v}%'`
    }else{
        return `${where} and \`${k}\` like '%${v}%'`
    }
}

// 日期查询函数
// v包括今天，昨天，本周，上周，本月，上月，自定义
function andDate(where,k,v){
    let searchStr = '';
    // 自定义
    if(v.split('/').length>0){
        let start = v.split('/')[0];
        let end = v.split('/')[1];
        searchStr = `\`${k}\` between '${start}' and '${end}'`;   
    }
    if(v=="上月"){
        searchStr = `date_format(${k},'%Y-%m')=date_format(DATE_SUB(curdate(), INTERVAL 1 MONTH),'%Y-%m')`; 
    }
    if(v=="本月"){
        searchStr = `date_format(${k},'%Y-%m')=date_format(now(),'%Y-%m')`;
    }
    if(v=="上周"){
        searchStr = `YEARWEEK(date_format(${k},'%Y-%m-%d')) = YEARWEEK(now())-1`;
    }
    if(v=="本周"){
        searchStr = `YEARWEEK(date_format(${k},'%Y-%m-%d')) = YEARWEEK(now())`;
    }
    if(v=="昨天"){
        searchStr = `to_days(NOW()) - TO_DAYS(${k}) >= 1`;
    }
    if(v=="今天"){
        searchStr = `to_days(NOW()) - to_days(${k}) < 1`;
    }
    if(where == 'where'){
        return `${where} `+searchStr;
    }else{
        return `${where} and `+searchStr;
    }
}

module.exports = {
    querySql,
    queryOne,
    insert,
    update,
    and,
    andLike,
    incrementId,
    andDate
}