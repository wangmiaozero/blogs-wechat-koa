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
// 查询是否点赞过
async function selectLike(openid, articleID) {
  const sql = `select * from articleLike where openid='${openid}' and articleID='${articleID}'`
  let result = null
  await query(sql, []).then(res => (result = res))
  return result
}
// 插入点赞文章
async function insertLikes(openid, articleID, isLike, time) {
  const sql = `insert into articleLike (openid,articleID,isLike,time) values ('${openid}','${articleID}','${isLike}','${time}')`
  let result = null
  await query(sql, []).then(res => (result = res))
  return result
}

// 更新点赞状态
async function updateLike(isLike, openid, articleID, updateTime) {
  const sql = `update articleLike set isLike='${isLike}',updateTime='${updateTime}' where openid='${openid}' and articleID='${articleID}' `
  let result = null
  await query(sql, []).then(res => (result = res))
  return result
}

//取消和点赞文章
async function like(ctx, next) {
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
    ctx.request.body.isLike === '' ||
    ctx.request.body.isLike === null
  )
    return (ctx.body = { code: 4003, message: '参数错误' })
  let { articleID, isLike } = ctx.request.body
  let likeResult = await selectLike(result.v.openid, articleID)
  if (likeResult.length === 0) {
    await insertLikes(result.v.openid, articleID, 1, createdTime().timeTwo)
    return (ctx.body = { code: 200, message: '点赞成功' })
  } else {
    if (ctx.request.body.isLike === 0) {
      await updateLike(1, result.v.openid, articleID, createdTime().timeTwo)
      return (ctx.body = { code: 200, message: '点赞成功' })
    } else {
      await updateLike(0, result.v.openid, articleID, createdTime().timeTwo)
      return (ctx.body = { code: 200, message: '取消成功' })
    }
  }
}
module.exports = { like }
