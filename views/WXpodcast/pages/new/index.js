// pages/new/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    nodata: true,
    news: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      loading: false,
      nodata: true
      // news: res.result
    });
  },
  read(e) {
    var id = e.currentTarget.dataset.id;
    var article = e.currentTarget.dataset.article;
    wx.redirectTo({
      url: "/pages/detail/index?id=" + article
    });
    wx.u.changeStatus(id);
  }
});
