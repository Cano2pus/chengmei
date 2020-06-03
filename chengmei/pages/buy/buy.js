// pages/buy/buy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      good: JSON.parse(options.id)
    })
  },
  selectAddr(){
    wx.navigateTo({
      url: '../addr/addr'
    })
  }
})