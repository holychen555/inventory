const expressJwt = require('express-jwt');
const { PRIVATE_KEY } = require('../utils/constant');

const jwtAuth = expressJwt({
    secret: PRIVATE_KEY,
    credentialsRequired: true //设置为false就不进行检验了，游客也可以访问
}).unless({
    path: [
        '/',
        '/staff/login'
    ],//设置jwt认证白名单
})

module.exports = {
    jwtAuth
}