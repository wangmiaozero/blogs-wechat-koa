// pages/my/index.js
//定义全局变量 app.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userData: {},
    signNum: 0,
    sign: false,
    signTime: '',
    loading: true,
    noReadNewsCount: 0
  },

  onLoad: function(options) {
    var that = this
    this.spinShow()
  },
  onShow: function() {
    this.getUser()
  },
  onShareAppMessage() {
    return {
      title: '汪苗 博客',
      path: 'pages/index/index',
      imageUrl: '/images/blog.png'
    }
  },
  // 个人中心
  getUser() {
    app.globalData.fetch.Post('/wechat/api/getUserSignList', []).then(res => {
      if (res.code === 200) {
        var userData = {
          nickName: res.data.nickname,
          userPic: res.data.avatarurl
        }
        wx.setStorageSync('userInfo', userData)
        this.setData({
          sign: res.data.signFlag,
          signTime: res.data.time,
          userData: userData,
          signNum: res.data.daysNumber
        })
        wx.hideLoading()
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
    this.setData({
      userData: wx.getStorageSync('userInfo') || ''
    })
  },
  /*  getPhoneNumber(e) {
    console.log(e)
  }, */
  //授权获取用户数据
  bindGetUserInfo(e) {
    wx.showLoading({
      title: '授权中'
    })
    var that = this
    wx.login({
      success: () => {
        wx.getUserInfo({
          success: result => {
            console.log(result)
            let data = {
              data: result
            }
            wx.showLoading({
              title: '解锁中...',
              mask: true
            })
            app.globalData.fetch
              .Post('/wechat/api/authorization', data)
              .then(res => {
                if (res.code === 200) {
                  setTimeout(() => {
                    wx.hideLoading()
                  }, 1500)
                }
                if (res.code === -1) {
                  wx.showLoading({
                    title: res.message,
                    mask: true
                  })
                  setTimeout(() => {
                    wx.hideLoading()
                  }, 4000)
                }
              })
            var nickName = result.userInfo.nickName
            var userPic = result.userInfo.avatarUrl
            var userData = { nickName: nickName, userPic: userPic }
            wx.setStorageSync('userInfo', userData)
            that.setData({
              userData: userData
            })
          }
        })
      }
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 1000)
  },

  //签到
  sign() {
    var that = this
    wx.showLoading({
      title: '签到中'
    })
    app.globalData.fetch.Post('/wechat/api/sign', []).then(res => {
      if (res.code === 200) {
        that.getUser()
        setTimeout(function() {
          wx.hideLoading()
        }, 1500)
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
  },
  //赞赏
  praise() {
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?id=%2BeNdX0re3XygPc1CLmE7uw%3D%3D',
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  //分享
  share() {},
  spinShow: function() {
    var that = this
    setTimeout(function() {
      that.setData({
        loading: !that.data.loading
      })
    }, 1000)
  }
})
