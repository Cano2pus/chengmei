// pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info: app.globalData.userInfo
    })
  },
  getinfo(){
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo;
      }
    })
  }
})