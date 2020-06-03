// pages/addr/addr.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/userAddressList',
      method: "POST",
      data: {
        token: app.globalData.userInfo.token
      },
      header: {
        "content-type": "appliction/json"
      },
      success(res){
        that.setData({
          list: res.data.data
        })
        
      }
    })
  },
  addAddr(){
    wx.navigateTo({
      url: '../addAddr/addAddr',
    })
  }
})