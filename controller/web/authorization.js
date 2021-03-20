const query = require('../../api/index.js')
const http = require('http')
const https = require('https')
const iconv = require('iconv-lite')
const koa2Req = require('koa2-request')
const isOwnEmpty = require('../../utils/examineToken') //token 效验
const md5 = require('md5')
const { createdTime, formatDateFn } = require('../../utils/time.js')
const WXBizDataCrypt = require('../../utils/WXBizDataCrypt')
const isObj = require('../../utils/isObject')
async function authorizationSql(userInfo, openid) {
  let result = null
  const updateSql = `UPDATE user SET 
  nickname='${userInfo.nickName}',
  avatarurl='${userInfo.avatarUrl}',
  gender='${userInfo.gender}',
  country='${userInfo.country}',
  province='${userInfo.province}',
  city='${userInfo.city}',
  language='${userInfo.language}'
  WHERE openid='${openid}'
  `
  await query(updateSql, []).then(res => (result = res))
  return result
}
async function selectCode2Session() {
  const sql = 'SELECT * FROM code2Session'
  let appId = null
  await query(sql, []).then(res => (appId = res[0]['appid']))
  return appId
}
//获取用户信息
async function authorization(ctx, netx) {
  if (isObj(ctx.request.body)) {
    return (ctx.body = { code: 4003, message: '参数错误' })
  }
  let token = ctx.request.header.token
  if (token === '' || token === null)
    return (ctx.body = { code: 4001, message: 'token错误' })
  let result = null
  await isOwnEmpty(token).then(res => (result = res))
  if (result.flag) return (ctx.body = { code: -1, message: 'token过期!' })
  if (ctx.request.body.data) {
    let { encryptedData, iv, userInfo } = ctx.request.body.data // 获取 encryptedData, iv
    let upData = await authorizationSql(userInfo, result.v.openid)
    let appId = await selectCode2Session()
    // 把加密数据里的空格换成+号，因为在传输过程中，服务器会把+号替换为空格。
    encryptedData = encryptedData.replace(/ /g, '+')
    iv = iv.replace(/ /g, '+')
    const pc = await new WXBizDataCrypt(appId, result.v.session_key)
    let data = await pc.decryptData(encryptedData, iv) //  获取解密数据
    // console.log('解密后 data: ', data)
    if (upData.warningCount === 0)
      return (ctx.body = { code: 200, message: 'ok' })
    ctx.body = { code: 4001, message: '插入错误!' }
  }
}
module.exports = { authorization }
