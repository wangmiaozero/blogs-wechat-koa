// pages/collect/index.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    articles: [],
    list: [],
    nodata: true,
    loading: true,
    loadMore: false,
    loadMores: true,
    pagination: 1,
    pageSize: 5
  },
  onLoad: function(options) {
    this.getList();
  },
  getList(pagination, pageSize) {
    let data = {
      pagination: pagination || this.data.pagination,
      pageSize: pageSize || this.data.pageSize
    };
    app.globalData.fetch.Post("/wechat/api/my/collect/list", data).then(res => {
      if (res.code === 200) {
        if (res.data.length === 0) {
          this.setData({
            articles: [],
            nodata: true,
            loading: false,
            loadMore: false,
            bottomWord: "没有收藏,赶紧去收藏文章吧!"
          });
        } else {
          this.data.list = this.data.articles.concat(res.data);
          let a = Math.ceil(res.total / this.data.pageSize);
          console.log(this.data.pagination, a);
          if (this.data.pagination <= a) {
            this.setData({
              articles: this.data.list,
              nodata: false,
              loading: false,
              loadMore: false,
              bottomWord: "下拉加载更多"
            });
          }
          if (this.data.pagination === a) {
            this.setData({
              nodata: false,
              loading: false,
              loadMore: false,
              loadMores: false,
              bottomWord: "加载完"
            });
          }
        }
      } else {
        wx.showLoading({
          title: res.message,
          mask: true
        });
        setTimeout(() => {
          this.setData({
            loading: false
          });
        }, 4000);
      }
    });
  },
  onReachBottom: function() {
    if (this.data.loadMores) {
      this.setData({
        loadMore: true,
        bottomWord: "加载中"
      });
      let pagination = ++this.data.pagination || 1;
      this.getList(pagination, this.data.pageSize);
    }
  },
  detail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/detail/index?id=" + id
    });
  }
});
