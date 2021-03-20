const query = require('../../api/index.js')
const http = require('http')
const https = require('https')
const iconv = require('iconv-lite')
const koa2Req = require('koa2-request')
const { client, redis } = require('../../redis/index.js') // 你的redis配置文件路径
const md5 = require('md5')
const { createdTime, formatDateFn } = require('../../utils/time.js')
const isObj = require('../../utils/isObject')
// 查询appid
async function selectCode2Session() {
  const sql = 'SELECT * FROM code2Session'
  let appData = null
  await query(sql, []).then(res => (appData = res[0]))
  return appData
}
/**
 * 产生随机整数，包含下限值，但不包括上限值
 * @param {Number} lower 下限
 * @param {Number} upper 上限
 * @return {Number} 返回在下限到上限之间的一个随机整数
 */
function random(lower, upper) {
  return Math.floor(Math.random() * (upper - lower)) + lower
}
// 查询openid数组
async function selectUserOpenid(openid) {
  let result = null
  await query(`SELECT openid FROM user WHERE openid='${openid}'`, []).then(
    res => (result = res)
  )
  return result
}
// 插入用户openid
async function insertOpenid(openid) {
  const sqlInsert = `INSERT INTO user (openid,ctime) VALUES ('${openid}','${
    createdTime().timeTwo
  }')`
  let result = null
  await query(sqlInsert, []).then(res => (result = res))
  return result
}
// 向微信发送请求
async function sendFn(url) {
  let result = {}
  // 向微信服务器发送请求
  await koa2Req(url).then(x => {
    // 获取session_key和openid
    let userToken =
      md5(JSON.parse(x.body).openid + new Date().valueOf()) + random(1, 100000)
    result = {
      data: JSON.parse(x.body),
      userToken
    }
  })
  return result
}
// 登录凭证校验 授权
async function login(ctx, next) {
  let appData = await selectCode2Session()
  if (isObj(ctx.request.body)) {
    return (ctx.body = { code: 4003, message: '参数错误' })
  }
  let { code } = ctx.request.body
  code = code.constructor === String ? code : false
  if (!code) return (ctx.body = { code: 4003, message: '参数错误' })
  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appData.appid}&secret=${appData.appSecret}&js_code=${code}&grant_type=${appData.grant_type}`
  let wechatData = await sendFn(url)
  let result_openid = await selectUserOpenid(wechatData.data.openid)
  if (result_openid.length != 0) {
    return (
      client.set(wechatData.userToken, JSON.stringify(wechatData.data)),
      client.expire(wechatData.userToken, 60 * 60 * 1),
      (ctx.body = {
        code: 200,
        message: 'ok',
        data: { token: wechatData.userToken }
      })
    )
  } else {
    return (
      await insertOpenid(wechatData.data.openid),
      client.set(wechatData.userToken, JSON.stringify(wechatData.data)),
      client.expire(wechatData.userToken, 60 * 60 * 1),
      (ctx.body = {
        code: 200,
        message: 'ok',
        data: { token: wechatData.userToken }
      })
    )
  }
}
module.exports = { login }
