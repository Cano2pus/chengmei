// pages/addAddr/addAddr.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: "",
    detail: "",
    region: [],
    address: null 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(JSON.stringify(options) != "{}"){
      let address = JSON.parse(options.address);
      this.setData({
        address: address,
        name: address.name,
        phone: address.phone,
        region: [address.procince,address.city,address.area],
        detail: address.detailed
      })
    }
    
  },
  setName(e){
    this.setData({
      name: e.detail.value
    })
  },
  setPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  setDetail(e){
    this.setData({
      detail: e.detail.value
    })
  },
  bindRegionChange(e){
    this.setData({
      region: e.detail.value
    })
  },
  addAddr(){
    let data = {
      token: app.globalData.userInfo.token,
      name: this.data.name,
      phone: this.data.phone,
      procince: this.data.region[0],
      city: this.data.region[1],
      area: this.data.region[2],
      detailed: this.data.detail
    }
    if(this.data.address != null){
      data.address_id = this.data.address.address_id
    }
    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/userAddressAddModify',
      method: "POST",
      data: data,
      header: {
        "content-type": "appliction/json"
      },
      success(res){
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
        wx.navigateTo({
          url: '../addr/addr',
        })
      }
    })
  }
})