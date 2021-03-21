const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('./constant')

function isObject(o){
    return Object.prototype.toString.call(o) === "[object Object]"
}

function md5(s){
    //注意参数需要为String类型，否则会出错
    return crypto.createHash('md5')
    .update(String(s)).digest('hex');
}

function decoded(req){
    const authorization =  req.get('Authorization');
    let token = '';
    if(authorization.indexOf('Bearer')>=0){
        token = authorization.replace('Bearer ', '');
    }else {
        token = authorization
    }
    console.log(token);
    return jwt.verify(token,PRIVATE_KEY)
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
function parseTime(time, cFormat) {
    if (arguments.length === 0 || !time) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string')) {
        if ((/^[0-9]+$/.test(time))) {
          // support "1548221490638"
          time = parseInt(time)
        } else {
          // support safari
          // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
          time = time.replace(new RegExp(/-/gm), '/')
        }
      }
  
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
      return value.toString().padStart(2, '0')
    })
    return time_str
}

 //填充截取法-数字前补零
function padding(num, length) {
  //这里用slice和substr均可
  return (Array(length).join("0") + num).slice(-length);
}

module.exports={
    md5,
    decoded,
    isObject,
    parseTime,
    padding
}