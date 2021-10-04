# <div align="center">简易博客系统</div>

## 🎃 陌生人，你好呀~~

恭喜你发现了一个宝藏，在这儿能拥有属于自己的网站。

写文章、记笔记、心情说说、个人介绍等，应有尽有，属于自己的一片天 🌞

# About

整个项目分为两部分：前台项目接口、后台管理接口。涉及登陆、注册、自动部署、文章展示、文章详情、文章分类、获取用户信息、用户收藏等，构成一个完整的流程。

**注：此项目纯属个人瞎搞，不用于任何商业用途。本项目是2018年学习koa搭建的是老板本不在维护，现在最新版本前端和服务端采用了egg,接口项目重构了**

# 说明


> 如果对您对此项目有兴趣，可以点 "Star" 支持一下 谢谢！ ^\_^

> 开发环境 macOS windows10 nodejs 10.12.4

> 部署环境 阿里云 CentOS 7.2 64 位

# 技术交流

进群私聊管理员进微信群可以领取最新代码

> 微信：wm1061214467  回复：blogs


## 技术栈

nodejs + koa2 + es6/7 + redis + nginx + mysql +md5 + pm2+ koa-logger + koa-onerror

## 项目运行

```
项目运行之前，请确保系统已经安装以下应用
1、node (10.12.4 及以上版本)
2. 导入表 手动写入code2Session表appid，appSecret
```

```

cd blogs-wechat-koa

npm install

npm run serve

pm2 deploy deploy.yaml production upddate

```

小程序目录,直接导入就可以了

```
blogs-wechat-koa/views/WXpodcast
```

## 效果演示

#### (本演示效果，跟现在你运行版本差异非常大)

###### 移动端扫描下方二维码 小程序

<img src="https://oss.wangmiaozero.cn/blogs/wechat.jpg" width="250" height="250"/>


## 目标功能

- [x] 文章详情 -- 完成
- [x] 文章分类 -- 完成
- [x] 文章列表 -- 完成
- [x] 获取用户信息 -- 完成
- [x] 用户收藏 -- 完成 ✨✨
- [x] 个人中心 -- 完成
- [x] 测试接口 -- 完成
- [x] 用户点赞 -- 完成
- [x] 用户授权绑定-- 完成
- [x] 我的收藏列表 -- 完成
- [x] 每日签到 -- 完成
- [x] 用户信息解密 -- 完成
- [x] 工具类 -- 完成
- [x] 服务配置 -- 完成
- [x] 面具接口 -- 完成
- [x] 获取文章评论 -- 完成
- [x] 插入文章评论 -- 完成
- [x] 管理员权限验证 --
- [x] 超级管理员 --
- [x] 日志输出 -- 完成
- [x] 详情错误 -- 完成
- [x] 前后台路由同构 -- 完成
- [x] pm2 自动发布部署-- 完成


## 部分截图

<img src="https://oss.wangmiaozero.cn/wechat/demonstration/1.png" />
<img src="https://oss.wangmiaozero.cn/wechat/demonstration/2.png" />
<img src="https://oss.wangmiaozero.cn/wechat/demonstration/3.png" />
<img src="https://oss.wangmiaozero.cn/wechat/demonstration/4.png" />
<img src="https://oss.wangmiaozero.cn/wechat/demonstration/5.png" />
<img src="https://oss.wangmiaozero.cn/wechat/demonstration/6.png" />

## 项目布局

```
.
├── blogs-wechat     koa2后端服务项目(前后端分离)
│   │
│   ├── api
│   │   └── index.js                  koa2-mysql数据池连接封装
│   ├── config
|   |     └── index.js                服务与数据库配置
│   ├── controller
│   │   ├── admin                     后台管理系统控制器
│   │   └── web                       前台系统控制器
│   │       ├── articleDetail.js      文章详情接口
│   │       ├── articleType.js        文章分类接口
│   │       ├── articleTypeList.js    文章列表接口
│   │       ├── authorization.js      获取用户信息接口(解密用户信息ok)
│   │       ├── collect.js            收藏接口
│   │       ├── getUserSignList.js    个人中心接口
│   │       ├── index.js              测试接口
│   │       ├── like.js               点赞接口
│   │       ├── login.js              用户授权绑定接口
│   │       ├── myCollectList.js      我的收藏列表接口
│   │       ├── insertComment.js      插入文章评论
│   │       ├── getComment.js         获取文章评论接口
│   │       ├── maskVersion.js        面具接口
│   │       └── sign.js               签到接口
│   ├── db
│   │   └── index.js                  数据连接
│   ├── node_modules
│   │   └──xxx.js                     依赖包
│   ├── redis
│   │   └── index.js                 redis配置封装
│   ├── routes
│   │   └── index.js                 后端路由
│   ├── utils                        工具类
│   │   ├── examineToken.js          token过期配置封装
│   │   ├── isObject.js              判断对象是否为空
│   │   ├── time.js                  时间处理
│   │   └── WXBizDataCrypt.js        wechat用户解密算法
│   ├── views                        前端静态文件托管
│   ├── .gitignore                   git忽略文件
│   ├── deploy.yaml                  pm2自动发布配置
│   ├── index.js                     服务配置
│   ├── package-lock.json            包的版本号(快速下载依赖链接)
│   ├── package.json                 模块(npm run server/依赖包)
│   │
│   └──README.md                     文档说明
.


```

## License

[GPL](https://github.com/wangmiaozero/blogs-wechat-koa)
