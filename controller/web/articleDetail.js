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

// 查询是否收藏
async function mYisCollect(openid, articleID) {
  let result = null
  await query(
    `SELECT isCollect FROM collect where openid='${openid}' and articleID='${articleID}'`,
    []
  ).then(res => (result = res))
  return result
}
// 查询是否点赞
async function mYisLike(openid, articleID) {
  let result = null
  await query(
    `SELECT isLike FROM articleLike where openid='${openid}' and articleID='${articleID}'`,
    []
  ).then(res => (result = res))
  return result
}
// 查询文章详情
async function selectArtile(articleID) {
  let articleDetail = null
  const sql = `SELECT * FROM articles WHERE articleID=?`
  await query(sql, articleID).then(res => {
    articleDetail = res[0]
    redis.set(`articleDetailID=${res[0].articleID}`, JSON.stringify(res[0]))
    client.expire(`articleDetailID=${res[0].articleID}`, 60 * 60 * 168)
  })
  return articleDetail
}
// 更新浏览数
async function upDateReadCount(read_counts, articleID) {
  const sql = `UPDATE articles SET read_counts=${read_counts} WHERE articleID=${articleID}`
  let result = null
  await query(sql, articleID).then(res => (result = res))
  return result
}
// 文章详情接口
async function articleDetail(ctx, netx) {
  /*  if (isObj(ctx.request.body)) {
    return (ctx.body = { code: 4003, message: '参数错误' })
  } */
  let result = null
  var token = ctx.request.header.token || null
  if (token === '' || token === null)
    return (ctx.body = { code: 4001, message: 'token错误' })
  await isOwnEmpty(token).then(res => (result = res))
  if (result.flag) {
    return (ctx.body = { code: -1, message: 'token过期!' })
  } else {
    var articleID = ctx.params.articleID.split('=')[1] || '1'
    let isCollect = []
    let articleDetailRedis = await redis.get(`articleDetailID=${articleID}`)
    await mYisCollect(result.v.openid, articleID).then(res => {
      if (res.length === 0 || res[0].isCollect === 0) {
        isCollect = 0
      } else {
        isCollect = 1
      }
    })
    let isLike = []
    await mYisLike(result.v.openid, articleID).then(res => {
      if (res.length === 0 || res[0].isLike === 0) {
        isLike = 0
      } else {
        isLike = 1
      }
    })
    var articleDetailOnce = {}
    var articleDetail = {}
    await selectArtile(articleID).then(res => (articleDetailOnce = res))
    await upDateReadCount(++articleDetailOnce.read_counts, articleID)
    await selectArtile(articleID).then(res => (articleDetail = res))
    if (articleDetailRedis === null) {
      let data = {
        articleID: articleDetail.articleID,
        articleTime: articleDetail.articleTime,
        author: articleDetail.author,
        content: articleDetail.content,
        excerpt: articleDetail.excerpt,
        isShow: articleDetail.isShow,
        listPic: articleDetail.listPic,
        mdcontent: articleDetail.mdcontent,
        read_counts: articleDetail.read_counts,
        shareCode: articleDetail.shareCode,
        title: articleDetail.title,
        typeID: articleDetail.typeID
      }
      ctx.body = {
        code: 200,
        message: 'ok',
        data: data,
        isCollect: isCollect,
        isLike: isLike
      }
    } else {
      let dataRedis = JSON.parse(articleDetailRedis)
      let data = {
        articleID: dataRedis.articleID,
        articleTime: dataRedis.articleTime,
        author: dataRedis.author,
        content: dataRedis.content,
        excerpt: dataRedis.excerpt,
        isShow: dataRedis.isShow,
        listPic: dataRedis.listPic,
        mdcontent: dataRedis.mdcontent,
        read_counts: articleDetail.read_counts,
        shareCode: dataRedis.shareCode,
        title: dataRedis.title,
        typeID: dataRedis.typeID
      }
      ctx.body = {
        code: 200,
        message: 'ok',
        //  redis: 'wangmiao',
        data: data,
        isCollect: isCollect,
        isLike: isLike
      }
    }
  }
}
module.exports = { articleDetail }
