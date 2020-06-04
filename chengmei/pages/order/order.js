// pages/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    state: 1
  },
  getList(){
    let that = this;
    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/orderList',
      method: "POST",
      data: {
        token: app.globalData.userInfo.token,
        state: that.data.state
      },
      header: {
        "content-type": "appliction/json"
      },
      success(res){
        if(res.data.code == 2000){
          that.setData({
            list: res.data.data.data
          })
        }
      }
    })
  },
  handleRequest(_url, _id){
    let that = this;
    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/' + _url,
      method: "POST",
      data: {
        token: app.globalData.userInfo.token,
        id: _id
      },
      header: {
        "content-type": "appliction/json"
      },
      success(res){
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
        that.getList();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      state: options.state
    })
    this.getList();
  },
  changeTab(e){
    this.setData({
      state: e.currentTarget.dataset.tab
    })
    this.getList();
  },
  cancelOrder(e){
    this.handleRequest("cancelOrder", e.currentTarget.dataset.orderid)
  }
})