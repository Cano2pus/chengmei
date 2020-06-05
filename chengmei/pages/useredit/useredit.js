// pages/useredit/useredit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    field: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      field: options.field,
      value: app.globalData.userInfo[options.field]
    })
  },
  edit(e){
    this.setData({
      value: e.detail.value
    })
  },
  confirm(){
    let that = this;
    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/userModify',
      method: "POST",
      data: {
        token: app.globalData.userInfo.token,
        field: that.data.field,
        value: that.data.value
      },
      header: {
        'content-type': 'application/json'
      },
      success(res){
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        });
        
        if(res.data.code == 2000){
          setTimeout(function(){
            app.globalData.userInfo[that.data.field] = that.data.value;
            wx.navigateBack({});
          }, 1000)
        }
      }
    })
  }
})