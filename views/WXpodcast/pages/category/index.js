// pages/category/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    cateList: {},
    current: '',
    current_scroll: '',
    category: '',
    nodata: false, //暂无数据是否显示
    moreData: true, //更多数据
    loadMore: false,
    loadMores: false,
    articles: [],
    list: [],
    pagination: 1,
    pageSize: 5,
    typeID: 1
  },

  onLoad: function(options) {
    var that = this
    app.globalData.fetch.Post('/wechat/api/articleType', {}).then(res => {
      if (res.code === 200) {
        this.setData({
          cateList: res.data,
          current: res.data[0].id,
          current_scroll: res.data[0].id
        })
        that.getArticleList(res.data[0].id)
        that.spinShow()
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
  onShow: function() {},
  getArticleList(category, pageSize, pagination) {
    let data = {
      pagination: pagination || this.data.pagination,
      pageSize: pageSize || this.data.pageSize,
      typeID: JSON.parse(category) || this.data.typeID
    }
    app.globalData.fetch
      .Post('/wechat/api/articleType/lists', data)
      .then(result => {
        if (result.data.length === 0) {
          this.setData({
            articles: [],
            loadMore: false,
            bottomWord: '',
            moreData: false,
            nodata: true
          })
          return this.spinShow()
        } else {
          this.setData({
            moreData: true
          })
          this.spinShow()
        }
        if (result.code === 200) {
          this.data.list = this.data.articles.concat(result.data)
          let a = Math.ceil(result.total / this.data.pageSize)
          if (this.data.pagination === a) {
            this.setData({
              moreData: false,
              loading: false,
              loadMore: false,
              bottomWord: '加载完'
            })
          }
          if (this.data.pagination <= a) {
            this.setData({
              articles: this.data.list,
              nodata: false
            })
          }
          return this.spinShow()
        }
      })
  },
  handleChangeScroll({ detail }) {
    this.data.list = []
    this.data.articles = []
    this.setData({
      loading: true,
      current_scroll: detail.key,
      moreData: true,
      pagination: 1,
      list: [],
      articles: []
    })
    this.getArticleList(detail.key)
  },
  spinShow: function() {
    var that = this
    setTimeout(function() {
      that.setData({
        loading: false
      })
    }, 1000)
  },
  onReachBottom: function() {
    if (this.data.moreData) {
      this.setData({
        loadMore: true,
        bottomWord: '加载中'
      })
      let pagination = ++this.data.pagination || 1
      //  console.log('onReachBottom', this.data.current_scroll, pagination)
      this.getArticleList(
        this.data.current_scroll,
        this.data.pageSize,
        pagination
      )
    }
  },
  detail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id
    })
  },
  onShareAppMessage() {
    return {
      title: '汪苗 博客',
      path: 'pages/index/index',
      imageUrl: '/images/blog.png'
    }
  }
})
