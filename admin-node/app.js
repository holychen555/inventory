const express = require("express");
const router = require("./router")
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
app.use(bodyParser.json({limit:'50mb'}))//需要在路由之前使用bodyParser
app.use(router)
app.listen(9999,function(){
    console.log('HTTP SERVER is running on: http: //localhost: %s',9999);
})