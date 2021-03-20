// pages/about/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    QQ:"1061214467",
    email: "1061214467@qq.com",
    web:"http://www.wangmiaozero.com",
    github:"https://github.com/wangmiaozero",
    name: 'name1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  copyDataTap: function (a) {
    var t = a.target.dataset.index;
    wx.setClipboardData({
      data: t,
      success: function (a) {
        wx.getClipboardData({
          success: function (a) {
            console.log(a.data);
          }
        });
      }
    });
  },
  open (){
    wx.navigateToMiniProgram({
      appId: 'wx33aded6302864055',
      path: 'pages/homepage/index',
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  }
})