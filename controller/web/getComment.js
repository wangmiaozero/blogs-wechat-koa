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
 *查询评论
 */
async function select_comments(article_id, comment_level) {
  const sql = `SELECT * from comment where article_id = ${article_id} and comment_level = ${comment_level} and status = 1 ORDER BY top_status desc ,praise_num desc`
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
 * 查询回复
 */
async function select_replys(article_id, comment_level) {
  const sql = `SELECT * from comment where  article_id = ${article_id} and comment_level = ${comment_level} and status = 1 ORDER BY create_time desc `
  // const sql = `SELECT count(*) as count from comment where parent_comment_id = ${parent_comment_id} and article_id = ${article_id}  and comment_level =${comment_level} and status = 1 ORDER BY create_time desc`
  /*  上面查询评论都是按照时间 create_time 倒叙，如果要改成微博的那种按照热度的 或者点赞量的
只需要把create_time 改成 praise_num */
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
async function getComment(ctx, netx) {
  let token = ctx.request.header.token
  if (token === '' || token === null)
    return (ctx.body = { code: 4001, message: 'token错误' })
  let result = null
  await isOwnEmpty(token).then(res => (result = res))
  if (result.flag) {
    return (ctx.body = { code: -1, message: 'token过期!' })
  } else {
    let webObject = ctx.request.body
    let comments = []
    let replys = []
    /* 文章id     一级评论 */
    await select_comments(webObject.article_id, 1).then(res => (comments = res))
    /* 文章id  父id   二级评论 */
    await select_replys(webObject.article_id, 2).then(res => (replys = res))
    let arr = []
    let arr1 = []
    if (comments.length !== 0) {
      comments.forEach(item => {
        let data_level_1 = {
          id: item.id,
          article_title: item.article_title,
          user_name: item.user_name,
          avatarurl: item.avatarurl,
          create_time: formatDateFn(new Date(`'${item.create_time}'`)).time,
          praise_num: item.praise_num,
          content: item.content
        }
        arr.push(data_level_1)
      })
    }
    if (comments.length !== 0) {
      replys.forEach(item => {
        let data_level_2 = {
          id: item.id,
          article_title: item.article_title,
          user_name: item.user_name,
          avatarurl: item.avatarurl,
          create_time: formatDateFn(new Date(`'${item.create_time}'`)).time,
          praise_num: item.praise_num,
          content: item.content,
          parent_comment_id: JSON.parse(item.parent_comment_id),
          reply_comment_name: item.reply_comment_name
        }
        arr1.push(data_level_2)
      })
    }
    return (ctx.body = {
      code: 200,
      message: 'ok',
      data: {
        comments: arr,
        replys: arr1
      }
    })
  }
}
module.exports = { getComment }
