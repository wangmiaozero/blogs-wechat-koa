const query = require('../../api/index.js')
const http = require('http')
const https = require('https')
const iconv = require('iconv-lite')
const koa2Req = require('koa2-request')
const isOwnEmpty = require('../../utils/examineToken') //token 效验
const { client, redis } = require('../../redis/index')
const md5 = require('md5')
const { createdTime, formatDateFn } = require('../../utils/time.js')

async function selectType(isShow, openid) {
  let result = null
  const sql = `SELECT id,typeName FROM articleType WHERE isShow='${isShow}' AND openid='${openid}'`
  await query(sql, []).then(res => {
    result = res
  })
  return result
}

// 栏目分类
async function selectArticleType(ctx, netx) {
  let result = null
  var token = ctx.request.header.token || 'oIcD15fWWJoWwtxvS_Ge07v6--xg'
  if (token === '' || token === null)
    return (ctx.body = { code: 4001, message: 'token错误' })
  await isOwnEmpty(token).then(res => (result = res))
  if (result.flag) {
    return (ctx.body = { code: -1, message: 'token过期!' })
  }
  let type = await selectType(1, 'oIcD15fWWJoWwtxvS_Ge07v6--xg')
  return (ctx.body = { code: 200, message: 'ok', data: type })
}
module.exports = { selectArticleType }
