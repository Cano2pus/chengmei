// pages/detail/detail.js
var wxParse = require("../../wxParse/wxParse");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good: null,
    banner: [],
    num: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/goodInfo',
      data: {
        good_id: options.id
      },
      header: {
        'content-type': 'application/json'
      },
      success(res){
        that.setData({
          good: res.data.data,
          banner: JSON.parse(res.data.data.info[0].imgs)
        })
        wxParse.wxParse('article', 'html', JSON.parse(that.data.good.info[0].info), that, 5);
      }
    })
  },
  reduce(){
    if(this.data.num <= 1){
      return ;
    }
    this.setData({
      num: --this.data.num
    })
  },
  add(){
    this.setData({
      num: ++this.data.num
    })
  },
  bindinput(e){
    this.setData({
      num: e.detail.value
    })
  },
  home(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  buy(){
    if(!app.globalData.userInfo){
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      return ;
    }
    let buyInfo = {
       img: this.data.banner[0],
       name: this.data.good.good_name,
       num: this.data.num,
       price: this.data.good.price,
       goodid: this.data.good.good_id
    }
    
    wx.navigateTo({
      url: '../buy/buy?id=' + JSON.stringify(buyInfo),
    })
  }
})