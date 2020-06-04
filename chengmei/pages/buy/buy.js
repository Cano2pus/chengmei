// pages/buy/buy.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good: null,
    address: null
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
  },
  submitOrder(){
    let that = this;
    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/addOrder',
      method: "POST",
      data: {
        token: app.globalData.userInfo.token,
        num: that.data.good.num,
        good_id: that.data.good.goodid,
        address_id: that.data.address.address_id
      },
      header: {
        "content-type": "appliction/json"
      },
      success(res){
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
        if(res.data.code == 2000){
          wx.navigateBack({});
        }
      }
    })
  }
})