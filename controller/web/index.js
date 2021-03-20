const query = require('../../api/index.js')
const http = require('http')
const https = require('https')
const iconv = require('iconv-lite')
const koa2Req = require('koa2-request')
//const redis = require('../redis/index.js') // 你的redis配置文件路径
const { client, redis } = require('../../redis/index.js') // 你的redis配置文件路径
const md5 = require('md5')
const { createdTime, formatDateFn } = require('../../utils/time.js')
module.exports = {
  // 测试接口
  testAPI: async (ctx, next) => {
    let html = 'Hello Koa 2!请求成功,233333!'
    ctx.body = { code: 200, value: html }
  }
}
