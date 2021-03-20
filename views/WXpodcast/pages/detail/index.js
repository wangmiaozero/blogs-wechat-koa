// pages/detail/index.js
const { $Message } = require('../../dist/base/index')
const { createdTime, formatDateFn } = require('../../utils/time')
const app = getApp()
Page({
  data: {
    loading: true,
    detail: {},
    spinShows: '',
    isShow: !1,
    menuBackgroup: !1,
    isCollect: 0,
    isLike: 0,
    userInfo: {},
    comments: [],
    replys: [],
    comment_count: 0,
    touch_active: false,
    articleID: 0,
    userName: '',
    commentId: '',
    commentContent: '',
    formID: 1,
    parentcommentid: '',
    status: null
  },

  onLoad: function(options) {
    this.setData({
      status: app.globalData.version_data.status || 0
    })
    var that = this
    var id = options.id
    var userInfo = wx.getStorageSync('userInfo')
    this.data.articleID = id
    app.globalData.fetch
      .Get(`/wechat/api/articles/Detail/articleID=${id}`)
      .then(res => {
        if (res.code === 200) {
          let data = {
            articleID: res.data.articleID,
            mdcontent: res.data.mdcontent,
            read_counts: res.data.read_counts,
            author: res.data.author,
            listPic: res.data.listPic,
            title: res.data.title,
            content: res.data.content,
            isShow: res.data.isShow,
            excerpt: res.data.excerpt,
            shareCode: res.data.shareCode,
            createdAt: formatDateFn(new Date(`${res.data.articleTime}`)).time
          }
          this.setData({
            detail: data,
            isCollect: res.isCollect,
            isLike: res.isLike
          })
          spinShows: setTimeout(function() {
            that.setData({
              loading: false,
              userInfo: userInfo
            })
          }, 1000)
        } else {
          wx.showLoading({
            title: res.message,
            mask: true
          })
          setTimeout(() => {
            wx.hideLoading()
          }, 4000)
        }
      })
    this.getComments(id)
  },
  onShareAppMessage() {
    return {
      title: this.data.detail.title,
      path: 'pages/detail/index?id=' + this.data.detail.articleID,
      imageUrl: '/images/blog.png'
    }
  },
  //功能展开
  showHideMenu: function() {
    console.log('show')
    this.setData({
      isShow: !this.data.isShow,
      isLoad: !1,
      menuBackgroup: !this.data.false
    })
  },
  //打开赞赏
  reward() {
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      // pages/apps/largess/detail?id=%2BeNdX0re3XygPc1CLmE7uw%3D%3D
      path: 'pages/apps/largess/detail?id=%2BeNdX0re3XygPc1CLmE7uw%3D%3D',
      envVersion: 'release',
      success(res) {
        console.log(res)
        // 打开成功
      }
    })
  },
  //生成海报
  createPic() {
    var id = this.data.detail.objectId
    var title = this.data.detail.title
    var shareCode = this.data.shareCode
    var listPic = this.data.detail.listPic
    wx.navigateTo({
      url:
        '/pages/share/index?id=' +
        id +
        '&title=' +
        title +
        '&shareCode=' +
        shareCode +
        '&listPic=' +
        listPic
    })
  },
  //取消和收藏文章
  collection(e) {
    // console.log(this.data.detail)
    var id = this.data.detail.articleID
    var action = e.currentTarget.dataset.action
    let data = {
      articleID: id,
      isCollect: this.data.isCollect
    }
    if (action == 'noCollect') {
      // 已收藏
      app.globalData.fetch
        .Post(`/wechat/api/article/collect`, data)
        .then(res => {
          if (res.code === 200) {
            this.setData({
              isCollect: 0
            })
            $Message({
              content: '取消成功',
              type: 'success'
            })
          } else {
            wx.showLoading({
              title: res.message,
              mask: true
            })
            setTimeout(() => {
              wx.hideLoading()
            }, 4000)
          }
        })
    } else {
      // 未收藏
      app.globalData.fetch
        .Post(`/wechat/api/article/collect`, data)
        .then(res => {
          if (res.code === 200) {
            this.setData({
              isCollect: 1
            })
            $Message({
              content: '收藏成功',
              type: 'success'
            })
          } else {
            wx.showLoading({
              title: res.message,
              mask: true
            })
            setTimeout(() => {
              wx.hideLoading()
            }, 4000)
          }
        })
    }
  },
  //取消和点赞文章
  like(e) {
    var id = this.data.detail.articleID
    var action = e.currentTarget.dataset.action
    let data = {
      articleID: id,
      isLike: this.data.isLike
    }
    if (action == 'noLike') {
      // 已点赞
      app.globalData.fetch.Post(`/wechat/api/article/like`, data).then(res => {
        if (res.code === 200) {
          this.setData({
            isLike: 0
          })
          $Message({
            content: '取消成功',
            type: 'success'
          })
        } else {
          wx.showLoading({
            title: res.message,
            mask: true
          })
          setTimeout(() => {
            wx.hideLoading()
          }, 4000)
        }
      })
    } else {
      // 未点赞
      app.globalData.fetch.Post(`/wechat/api/article/like`, data).then(res => {
        if (res.code === 200) {
          this.setData({
            isLike: 1
          })
          $Message({
            content: '点赞成功',
            type: 'success'
          })
        } else {
          wx.showLoading({
            title: res.message,
            mask: true
          })
          setTimeout(() => {
            wx.hideLoading()
          }, 4000)
        }
      })
    }
  },
  getComments(id) {
    let data = {
      article_id: JSON.parse(id)
    }
    app.globalData.fetch.Post(`/wechat/api/getComment`, data).then(res => {
      if (res.code === 200) {
        this.setData({
          comment_count: res.data.comments.length,
          comments: res.data.comments,
          replys: res.data.replys
        })
      }
    })
  },
  hendelGetValue(e) {
    if (e.detail.cursor == 0) {
      this.setData({
        formID: 1
      })
    }
    if (e.detail.value != '') {
      this.setData({
        touch_active: true
      })
    } else {
      this.setData({
        touch_active: false
      })
    }
  },
  replyComment(e) {
    this.setData({
      userName: e.currentTarget.dataset.nickname,
      commentId: e.currentTarget.dataset.id,
      formID: e.currentTarget.dataset.formid,
      parentcommentid: e.currentTarget.dataset.parentcommentid,
      commentContent: '回复 @' + e.currentTarget.dataset.nickname + ' '
    })
  },
  formSubmit(e) {
    var content = e.detail.value.inputComment.split(' ').pop()
    var commentId = this.data.commentId
    var parentcommentid = this.data.parentcommentid
    var formID = JSON.parse(this.data.formID)
    if (!content) {
      $Message({
        content: '请输入评论内容',
        type: 'warning'
      })
      return false
    }
    let data = {}
    switch (formID) {
      case 1:
        data = {
          type: 1,
          content: content,
          article_id: this.data.articleID
        }
        break
      case 2:
        data = {
          type: 2,
          content: content,
          comment_id: commentId,
          article_id: this.data.articleID
        }
        break
      case 3:
        data = {
          type: 3,
          content: content,
          comment_id: commentId,
          article_id: this.data.articleID,
          parent_comment_id: parentcommentid
        }
        break
    }
    app.globalData.fetch.Post(`/wechat/api/insetComment`, data).then(res => {
      if (res.code === 200) {
        this.getComments(this.data.articleID)
        $Message({
          content: '评论成功,管理员会进行审核',
          type: 'success'
        })
      } else {
        $Message({
          content: '评论失败',
          type: 'warning'
        })
      }
    })
  },
  // 去往授权
  goMy() {
    wx.switchTab({
      url: '/pages/my/index'
    })
  }
})
