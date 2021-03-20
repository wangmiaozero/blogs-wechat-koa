const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    moreData: true, //更多数据
    pageSize: 5, //数量
    pagination: 1, //页码
    articles: [],
    bottomWord: '',
    loadMore: false,
    loadMores: false
  },

  onLoad: function(options) {
    var that = this
    this.getArticleList(that.data.pageSize, that.data.pagination)
  },
  onShow: function() {
    this.spinShow()
  },
  getArticleList(pageSize, pagination) {
    let wangmiao = {
      pagination: pagination || 1,
      pageSize: pageSize || 5
    }
    app.globalData.fetch
      .Post('/wechat/api/articleType/lists', wangmiao)
      .then(res => {
        if (res.code === 200) {
          let list = this.data.articles.concat(res.data)
          // let page = this.data.pagination * this.data.pageSize
          let a = Math.ceil(res.total / this.data.pageSize)
          if (this.data.pagination <= a) {
            this.setData({
              articles: list
            })
          } else {
            this.setData({
              moreData: false,
              bottomWord: '加载完',
              loadMore: false
            })
          }
          this.spinShow()
        }
      })
      .catch(err => {
        console.log(err)
        console.log(err.data.code, res)
        if (res.data.code == -1) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
  },
  onReachBottom: function() {
    if (this.data.moreData) {
      this.setData({
        loadMore: true,
        bottomWord: '加载中'
      })
      let pagination = ++this.data.pagination || 1
      console.log(pagination)
      this.getArticleList(this.data.pageSize, pagination)
    }
  },
  spinShow: function() {
    var that = this
    setTimeout(function() {
      that.setData({
        loading: false
      })
    }, 1500)
  },
  onShareAppMessage() {
    return {
      title: '汪苗 博客',
      path: 'pages/index/index',
      imageUrl: '/images/blog.png'
    }
  }
})
