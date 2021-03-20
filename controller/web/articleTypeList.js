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

async function selectTypeArticleList(
  isShow,
  telnum,
  pagination,
  pageSize,
  typeID
) {
  let result = null
  let sqlWhere = null
  if (typeID === '') {
    sqlWhere = ` isShow=${isShow} AND telnum='${telnum}'`
  } else {
    sqlWhere = ` isShow=${isShow} AND telnum='${telnum}' AND  typeID=${typeID}`
  }
  sql = `SELECT articleID,
  title,
  author,
  listPic,
  excerpt,
  read_counts,
  typeID,
  articleTime 
  FROM 
  articles 
  WHERE ${sqlWhere}
  ORDER BY articleID DESC limit ${pagination},${pageSize}`
  await query(sql, []).then(res => (result = res))
  return result
}

async function selectTotal(isShow, telnum, typeID) {
  let result = null
  let sqlWhere = null
  if (typeID === '') {
    sqlWhere = ` isShow=${isShow} AND telnum='${telnum}'`
  } else {
    sqlWhere = ` isShow=${isShow} AND telnum='${telnum}' AND  typeID=${typeID}`
  }
  const articlesLength = `SELECT count(*) as total
  FROM 
  articles 
  WHERE ${sqlWhere}`
  await query(articlesLength, []).then(res => (result = res))
  return result
}

// 栏目分类
async function selectArticleTypeList(ctx, netx) {
  if (isObj(ctx.request.body)) {
    return (ctx.body = { code: 4003, message: '参数错误' })
  }
  let result = null
  var token = ctx.request.header.token || 'oIcD15fWWJoWwtxvS_Ge07v6--xg'
  if (token === '' || token === null)
    return (ctx.body = { code: 4001, message: 'token错误' })
  await isOwnEmpty(token).then(res => (result = res))
  if (result.flag) return (ctx.body = { code: -1, message: 'token过期!' })
  if (
    ctx.request.body.pagination === '' ||
    ctx.request.body.pagination === null ||
    ctx.request.body.pageSize === '' ||
    ctx.request.body.pageSize === null
  )
    return (ctx.body = { code: 4003, message: '参数错误!' })
  let telnum = '17615848207'
  let pagination = 5 * ctx.request.body.pagination - 5 || 0
  let pageSize = ctx.request.body.pageSize || 5
  let typeID = ctx.request.body.typeID || ''
  let list = await selectTypeArticleList(
    1,
    telnum,
    pagination,
    pageSize,
    typeID
  )
  var arr = []
  await list.forEach(item => {
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
  let total = await selectTotal(1, telnum, typeID)
  return (ctx.body = {
    code: 200,
    message: 'ok',
    total: total[0].total,
    data: arr
  })
}
module.exports = { selectArticleTypeList }
