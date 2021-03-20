const query = require('../../api/index.js')
const http = require('http')
const https = require('https')
const iconv = require('iconv-lite')
const koa2Req = require('koa2-request')
const isOwnEmpty = require('../../utils/examineToken') //token 效验
const md5 = require('md5')
const { createdTime, formatDateFn } = require('../../utils/time.js')
const isObj = require('../../utils/isObject')

async function selectMyCollect(pagination, pageSize, telnum) {
  let result = null
  const sql = `SELECT
  a.articleID,
  a.title,
  a.author,
  a.listPic,
  a.excerpt,
  a.read_counts,
  a.articleTime 
FROM
  articles a
  RIGHT JOIN
  collect c ON a.articleID = c.articleID 
WHERE
  a.isShow = 1 
  AND a.telnum = ${telnum}
ORDER BY
  a.articleID DESC limit ${pagination},${pageSize}`
  await query(sql, []).then(res => (result = res))
  return result
}

async function selectTotal(isShow, telnum, collectTypeID) {
  let result = null
  let sqlWhere = null
  if (collectTypeID === '') {
    sqlWhere = ` isShow=${isShow} AND telnum='${telnum}'`
  } else {
    sqlWhere = ` isShow=${isShow} AND telnum='${telnum}' AND  collectTypeID=${collectTypeID}`
  }
  const articlesLength = `SELECT count(*) as total
  FROM 
  articles a
  RIGHT JOIN
  collect c ON a.articleID = c.articleID 
  WHERE ${sqlWhere}`
  await query(articlesLength, []).then(res => (result = res))
  return result
}

async function myCollect(ctx, next) {
  if (isObj(ctx.request.body)) {
    return (ctx.body = { code: 4003, message: '参数错误' })
  }
  var token = ctx.request.header.token || null
  if (token === '' || token === null)
    return (ctx.body = { code: 4001, message: 'token错误' })
  await isOwnEmpty(token).then(res => (result = res))
  if (result.flag) {
    return (ctx.body = { code: -1, message: 'token过期!' })
  }
  console.log(
    ctx.request.body,
    ctx.request.body.pagination,
    ctx.request.body.pageSize
  )
  let pagination = 5 * ctx.request.body.pagination - 5 || 0
  let pageSize = ctx.request.body.pageSize || 5
  let telnum = 17615848207
  let collectTypeID = ctx.request.body.collectTypeID || 0
  let myCollectResult = await selectMyCollect(pagination, pageSize, telnum)
  let total = await selectTotal(1, telnum, collectTypeID)
  let arr = []
  await myCollectResult.forEach(item => {
    let data = {
      typeID: item.typeID || '',
      articleID: item.articleID || '',
      articleTime: formatDateFn(new Date(`'${item.articleTime}'`)).time,
      author: item.author,
      excerpt: item.excerpt,
      listPic: item.listPic,
      read_counts: item.read_counts,
      title: item.title
    }
    arr.push(data)
  })
  return (ctx.body = {
    code: 200,
    message: 'ok',
    total: total[0].total,
    data: arr
  })
}
module.exports = { myCollect }
