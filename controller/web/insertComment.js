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
 *插入评论
 */
async function insert_comments(
  user_id,
  user_name,
  avatarurl,
  article_id,
  article_title,
  parent_comment_id,
  content,
  create_time
) {
  const sql = `INSERT INTO comment (user_id,user_name,avatarurl,article_id,article_title,parent_comment_id,content,create_time) VALUES 
  ('${user_id}','${user_name}','${avatarurl}','${article_id}','${article_title}','${parent_comment_id}','${content}','${create_time}')`
  var list = []
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
/*
 * 插入回复
 */
async function insert_replys(
  user_id,
  user_name,
  avatarurl,
  article_id,
  article_title,
  parent_comment_id,
  comment_level,
  content,
  create_time,
  reply_comment_id,
  reply_comment_name
) {
  let sql = null
  if (reply_comment_id && reply_comment_name) {
    sql = `INSERT INTO comment (user_id,user_name,avatarurl,article_id,article_title,parent_comment_id,comment_level,content,create_time,reply_comment_id,reply_comment_name) VALUES 
    ('${user_id}','${user_name}','${avatarurl}','${article_id}','${article_title}','${parent_comment_id}','${comment_level}','${content}','${create_time}','${reply_comment_id}','${reply_comment_name}')`
  } else {
    sql = `INSERT INTO comment (user_id,user_name,avatarurl,article_id,article_title,parent_comment_id,comment_level,content,create_time) VALUES 
    ('${user_id}','${user_name}','${avatarurl}','${article_id}','${article_title}','${parent_comment_id}','${comment_level}','${content}','${create_time}')`
  }
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
/*
 * 查询用户信息
 */
async function select_user(openid) {
  const sql = `SELECT u.avatarurl,u.nickname FROM user u WHERE openid='${openid}'`
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
/*
 * 查询评论
 */
async function select_comment(id) {
  const sql = `SELECT c.user_name FROM comment c  WHERE id='${id}'`
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
/*
 * 查询用户文章
 */
async function select_article(articleID) {
  const sql = `SELECT a.title FROM articles a  WHERE articleID='${articleID}'`
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
/*
 * 评论方法
 */
async function insertComment(ctx, netx) {
  let token = ctx.request.header.token
  if (token === '' || token === null)
    return (ctx.body = { code: 4001, message: 'token错误' })
  let result = null
  await isOwnEmpty(token).then(res => (result = res))
  if (result.flag) {
    return (ctx.body = { code: -1, message: 'token过期!' })
  } else {
    let webObject = ctx.request.body
    if (webObject.type === '' || webObject.type === null)
      return (ctx.body = { code: 4003, message: '参数错误!' })
    let article_title = ''
    let user = {}
    await select_user(result.v.openid).then(res => (user = res))
    await select_article(webObject.article_id).then(
      res => (article_title = res[0].title)
    )
    if (
      webObject.content === '' ||
      webObject.content === null ||
      webObject.article_id === '' ||
      webObject.article_id === null
    )
      return (ctx.body = { code: 4003, message: '参数错误!' })
    switch (webObject.type) {
      case 1:
        await insert_comments(
          result.v.openid,
          user[0].nickname,
          user[0].avatarurl,
          webObject.article_id,
          article_title,
          '-1',
          webObject.content,
          createdTime().timeTwo
        )
        break
      case 2:
        if (webObject.comment_id === '' || webObject.comment_id === null)
          return (ctx.body = { code: 4003, message: '参数错误!' })
        await insert_replys(
          result.v.openid,
          user[0].nickname,
          user[0].avatarurl,
          webObject.article_id,
          article_title,
          webObject.comment_id,
          2,
          webObject.content,
          createdTime().timeTwo
        ) /* .then(res => {
          console.log(res)
        }) */
        break
      case 3:
        let user_name = null
        await select_comment(webObject.comment_id).then(
          res => (user_name = res[0].user_name)
        )
        if (
          webObject.comment_id === '' ||
          webObject.comment_id === null ||
          webObject.parent_comment_id === '' ||
          webObject.parent_comment_id === null
        )
          return (ctx.body = { code: 4003, message: '参数错误!' })
        await insert_replys(
          result.v.openid,
          user[0].nickname,
          user[0].avatarurl,
          webObject.article_id,
          article_title,
          webObject.parent_comment_id,
          2,
          webObject.content,
          createdTime().timeTwo,
          webObject.comment_id,
          user_name
        ) /* .then(res => {
        console.log(res)
      }) */
        break
      default:
        break
    }
    return (ctx.body = {
      code: 200,
      message: 'ok'
    })
  }
}
module.exports = { insertComment }
