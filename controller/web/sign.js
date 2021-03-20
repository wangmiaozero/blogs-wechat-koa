const query = require('../../api/index.js')
const http = require('http')
const https = require('https')
const iconv = require('iconv-lite')
const koa2Req = require('koa2-request')
const isOwnEmpty = require('../../utils/examineToken') //token 效验
const md5 = require('md5')
const { createdTime, formatDateFn } = require('../../utils/time.js')
const isObj = require('../../utils/isObject')
// 签到接口
async function sign(ctx, netx) {
  /* if (isObj(ctx.request.body)) {
    return (ctx.body = { code: 4003, message: '参数错误' })
  } */
  let token = ctx.request.header.token
  let result = null
  if (token === '' || token === null)
    return (ctx.body = { code: 4001, message: 'token错误' })
  await isOwnEmpty(token).then(res => (result = res))
  if (result.flag) {
    return (ctx.body = { code: -1, message: 'token过期!' })
  }
  const selectSql = `select * from sign where  time>'${
    createdTime().presenTdate
  } 00:00:00' and openid = '${result.v.openid}'`
  var selectSqlSign = []
  await query(selectSql, []).then(res => (selectSqlSign = res))
  if (selectSqlSign.length === 0) {
    await query(
      `INSERT INTO sign (openid,time) VALUES ('${result.v.openid}','${
        createdTime().timeTwo
      }')`,
      []
    )
      .then(res => {
        ctx.body = { code: 200, message: 'ok' }
      })
      .catch(err => {
        ctx.body = { code: 4000, message: err }
      })
  } else {
    ctx.body = { code: 4002, message: '今日已经签到' }
  }
}
module.exports = { sign }
