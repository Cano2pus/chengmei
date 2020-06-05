// pages/addr/addr.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  getList(){
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getList();
  },
  addAddr(e){
    wx.navigateTo({
      url: '../addAddr/addAddr',
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
  setDefaultAddr(e){
    this.handleRequest("userAddressDfault", e.currentTarget.dataset.addrid);
  },
  deleteAddr(e){
    this.handleRequest("userAddressDelete", e.currentTarget.dataset.addrid);
  },
  editAddr(e){
    wx.navigateTo({
      url: '../addAddr/addAddr?address=' + JSON.stringify(e.currentTarget.dataset.addrid),
    })
  },
  selectAddr(e){
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      address: e.currentTarget.dataset.id
    })

    wx.navigateBack({});
  },
  onShow(){
    this.getList();
  }
})