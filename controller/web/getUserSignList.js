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
 *用户签到天数方法
 */
async function userSign(mydata) {
  const selectSqlSign = `select count(*) as num from sign where openid='${mydata.openid}'`
  var Sign_count = [] // 签到数组对象
  await query(selectSqlSign, [])
    .then(res => {
      if (res.length === 0) {
        Sign_count = {
          daysNumber: 0
        }
      } else {
        Sign_count = res[0]
      }
    })
    .catch(err => (Sign_count = err))
  return Sign_count
}
/*
 *用户信息方法
 */
async function user(mydata) {
  const selectSqlUser = `select nickname,avatarurl from user where openid='${mydata.openid}'`
  var select_User = {}
  await query(selectSqlUser, [])
    .then(res => (select_User = res[0]))
    .catch(err => (select_User = err))
  return select_User
}
/*
 *用户是否能签到方法
 */
async function isSign(mydata) {
  const selectConditionSql = `select * from sign where  time>'${
    createdTime().presenTdate
  } 00:00:00' and openid = '${mydata.openid}'`
  var signFlag = {}
  await query(selectConditionSql, [])
    .then(res => (signFlag = res))
    .catch(err => (signFlag = err))
  return signFlag
}

/*
 * 个人中心 方法
 */
async function getUserSignList(ctx, netx) {
  /* if (isObj(ctx.request.body)) {
    return (ctx.body = { code: 4003, message: '参数错误' })
  } */
  let token = ctx.request.header.token
  if (token === '' || token === null)
    return (ctx.body = { code: 4001, message: 'token错误' })
  let result = null
  var Sign_count = [] // 签到数组对象
  var select_User = [] //用户信息
  var signFlag = [] // 用户是否满足签到条件
  await isOwnEmpty(token).then(res => (result = res))
  if (result.flag) {
    return (ctx.body = { code: -1, message: 'token过期!' })
  } else {
    await userSign(result.v).then(res => (Sign_count = res))
    await user(result.v).then(res => (select_User = res))
    await isSign(result.v).then(res => (signFlag = res))
    if (Sign_count.num === 0) {
      return (ctx.body = {
        code: 200,
        message: '暂时无数据'
      })
    }
    let time = '0000-00-00 00:00:00'
    let id = 1
    if (signFlag.length !== 0) {
      time = formatDateFn(new Date(`'${signFlag[0].time}'`)).time
      id = signFlag[0].id
    }
    let data = {
      daysNumber: Sign_count.num || 0,
      avatarurl: select_User.avatarurl,
      nickname: select_User.nickname,
      signFlag: signFlag.length != 0 ? 1 : 0, //1不可以签到 0可以签到
      time: time,
      id: id
    }
    return (ctx.body = {
      code: 200,
      message: 'ok',
      data: data
    })
  }
}
module.exports = { getUserSignList }
