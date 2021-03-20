const query = require('../../api/index.js')
const http = require('http')
const https = require('https')
const iconv = require('iconv-lite')
const koa2Req = require('koa2-request')
const isOwnEmpty = require('../../utils/examineToken') //token 效验
const md5 = require('md5')
const { createdTime, formatDateFn } = require('../../utils/time.js')
const isObj = require('../../utils/isObject')
/*
 * 查询版本
 */
async function select_mask(version) {
  const sql = `SELECT * FROM mask   WHERE version='${version}'`
  let list = []
  await query(sql, [])
    .then(res => {
      if (res.length !== 0) {
        list = res
      } else {
        list = res
      }
    })
    .catch(err => (list = err))
  return list
}
// 面具方法 逃避审核
async function maskVersion(ctx, netx) {
  let webObject = ctx.request.body
  if (webObject.version === '' || webObject.version === null)
    return (ctx.body = { code: 4003, message: '参数错误!' })
  await select_mask(webObject.version).then(res => {
    return (ctx.body = {
      code: 200,
      message: 'ok',
      data: res[0]
    })
  })
}
module.exports = { maskVersion }
