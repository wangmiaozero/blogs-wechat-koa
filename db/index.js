const config = require('../config/index.js')
const mysql = require('mysql')
// 创建数据池
const pool = mysql.createPool({
  host: config.database.HOST, // 数据库地址
  user: config.database.USER, // 数据库用户
  port: config.database.PORT,
  password: config.database.PASSWORD, // 数据库密码
  database: config.database.DATABASE // 选中数据库
})

module.exports = pool
