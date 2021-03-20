const router = require('koa-router')()
const ctrl = require('../controller/web/index.js')
const login = require('../controller/web/login.js')
const articleDetail = require('../controller/web/articleDetail.js')
const getUserSignList = require('../controller/web/getUserSignList.js')
const sign = require('../controller/web/sign.js')
const authorization = require('../controller/web/authorization.js')
const collect = require('../controller/web/collect.js')
const like = require('../controller/web/like.js')
const articleType = require('../controller/web/articleType.js')
const articleTypeList = require('../controller/web/articleTypeList.js')
const myCollectList = require('../controller/web/myCollectList.js')
const getComment = require('../controller/web/getComment.js')
const insertComment = require('../controller/web/insertComment.js')
const maskVersion = require('../controller/web/maskVersion.js')
router.get('/', async (ctx, next) => {
  'use strict'
  ctx.redirect('/index')
})
// 测试接口
router.get('/index', ctrl.testAPI)
// 登录接口
router.post('/wechat/api/login', login.login)
// 获取用户信息authorization授权
router.post('/wechat/api/authorization', authorization.authorization)
//签到接口
router.post('/wechat/api/sign', sign.sign)
// 获取天数 个人中心
router.post('/wechat/api/getUserSignList', getUserSignList.getUserSignList)
// 文章列表页
router.post(
  `/wechat/api/articleType/lists`,
  articleTypeList.selectArticleTypeList
)
// 文章详情页
router.get(
  `/wechat/api/articles/Detail/:articleID`,
  articleDetail.articleDetail
)
// 收藏文章
router.post(`/wechat/api/article/collect`, collect.collect)
// 点赞文章
router.post(`/wechat/api/article/like`, like.like)
// 文章获取分类列表
router.post(`/wechat/api/articleType`, articleType.selectArticleType)
//  我的收藏
router.post(`/wechat/api/my/collect/list`, myCollectList.myCollect)
// 获取用户评论
router.post(`/wechat/api/getComment`, getComment.getComment)
// 插入评论
router.post(`/wechat/api/insetComment`, insertComment.insertComment)
// 面具系统
router.post(`/wechat/api/mask/version`, maskVersion.maskVersion)

module.exports = router
