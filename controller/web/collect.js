const query = require('../../api/index.js')
const http = require('http')
const https = require('https')
const iconv = require('iconv-lite')
const koa2Req = require('koa2-request')
const isOwnEmpty = require('../../utils/examineToken') //token 效验
const { client, redis } = require('../../redis/index')
const md5 = require('md5')
const { createdTime, formatDateFn } = require('../../utils/time.js')
const isObj = require('../../utils/isObject')
// 查询是否收藏过
async function selectCollect(openid, articleID) {
  const sql = `select * from collect where openid='${openid}' and articleID='${articleID}'`
  let result = null
  await query(sql, []).then(res => (result = res))
  return result
}
// 插入收藏文章
async function insertCollects(openid, articleID, isCollect, time) {
  const sql = `insert into collect (openid,articleID,isCollect,time) values ('${openid}','${articleID}','${isCollect}','${time}')`
  let result = null
  await query(sql, []).then(res => (result = res))
  return result
}

// 更新收藏状态
async function updateCollect(isCollect, openid, articleID, updateTime) {
  const sql = `update collect set isCollect='${isCollect}',updateTime='${updateTime}' where openid='${openid}' and articleID='${articleID}' `
  let result = null
  await query(sql, []).then(res => (result = res))
  return result
}

//取消和收藏文章
async function collect(ctx, next) {
  if (isObj(ctx.request.body)) {
    return (ctx.body = { code: 4003, message: '参数错误' })
  }
  let result = null
  var token = ctx.request.header.token || null
  if (token === '' || token === null)
    return (ctx.body = { code: 4001, message: 'token错误' })
  await isOwnEmpty(token).then(res => (result = res))
  if (result.flag) {
    return (ctx.body = { code: -1, message: 'token过期!' })
  }
  if (
    ctx.request.body.articleID === '' ||
    ctx.request.body.articleID === null ||
    ctx.request.body.isCollect === '' ||
    ctx.request.body.isCollect === null
  )
    return (ctx.body = { code: 4003, message: '参数错误!' })
  let { articleID, isCollect } = ctx.request.body
  let collectResult = await selectCollect(result.v.openid, articleID)
  if (collectResult.length === 0) {
    await insertCollects(result.v.openid, articleID, 1, createdTime().timeTwo)
    return (ctx.body = { code: 200, message: '收藏成功' })
  } else {
    if (ctx.request.body.isCollect === 0) {
      await updateCollect(1, result.v.openid, articleID, createdTime().timeTwo)
      return (ctx.body = { code: 200, message: '收藏成功' })
    } else {
      await updateCollect(0, result.v.openid, articleID, createdTime().timeTwo)
      return (ctx.body = { code: 200, message: '取消成功' })
    }
  }
}
module.exports = { collect }
