const Koa = require('koa')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const Koa_Logger = require('koa-logger')
const Moment = require('moment')
const onerror = require('koa-onerror')
const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')
const config = require('./config/index')
const koaStatic = require('koa-static')
const response = require('koa2-response')
const index = require('./routes/index')
const { client, redis } = require('./redis/index') // 你的redis配置文件路径
const app = new Koa()
// 错误详情
onerror(app)
// 配置静态资源加载中间件
app.use(koaStatic(path.join(__dirname, './views')))
// 配置session中间件 post 参数解析
app.use(bodyParser({ enableTypes: ['json', 'form', 'text'] }))
const logger = Koa_Logger(str => {
  // 使用日志中间件
  console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str)
})
//全局配置
global.redis = client
// 配置跨域
app.use(async (ctx, next) => {
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    //'Access-Control-Allow-Headers,Content-Length, Authorization,Accept, X-Requested-With , yourHeaderFeild'
  ) // 服务器支持的所有头信息字段
  // ctx.set('Access-Control-Allow-Origin', '*')
  const { origin, Origin, referer, Referer } = ctx.request.header
  const allowOrigin = origin || Origin || referer || Referer || '*'
  ctx.set('Access-Control-Allow-Origin', allowOrigin)
  ctx.set('Content-Type', 'application/json; charset=utf-8')
  ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET,OPTIONS')
  ctx.set('Access-Control-Allow-Credentials', true) // 可以带cookies
  ctx.set('Access-Control-Max-Age', 3600 * 24)
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})
// 使用中间件
app.use(logger) // 日志输出

// 装载所有子路由
index.routes('/', index.routes(), index.allowedMethods())
index.routes('/wechat/api/login', index.routes(), index.allowedMethods())
// 加载路由中间件
app.use(index.routes(), index.allowedMethods())

module.exports = app
