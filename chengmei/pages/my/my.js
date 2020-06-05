// pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    avatarUrl: "http://img3.imgtn.bdimg.com/it/u=2395693894,1549853405&fm=26&gp=0.jpg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log(app.globalData.userInfo);

    if (app.globalData.userInfo != null) {
      this.setData({
        info: app.globalData.userInfo,
        avatarUrl: app.globalData.userInfo.icon
      })
    }
  },
  getUserInfo(e) {
    console.log(e);
    if (e.detail.userInfo) {
      let openid = wx.getStorageSync('openid');
      app.globalData.userInfo = e.detail.userInfo;
      wx.request({
        url: 'http://chengmei_dev.wanxikeji.cn/api/register',
        method: "POST",
        data: {
          nick_name: e.detail.userInfo.nickName,
          icon: e.detail.userInfo.avatarUrl,
          sex: e.detail.userInfo.gender,
          openid: openid
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res);

          if (res.code == 2000) {
            wx.login({
              success: res => {
                wx.request({
                  url: 'http://chengmei_dev.wanxikeji.cn/api/useCodeGetOpenId',
                  method: "POST",
                  data: {
                    code: res.code
                  },
                  header: {
                    "content-type": "appliction/json"
                  },
                  success(result) {
                    if (result.data.data.info) {
                      app.globalData.userInfo = result.data.data.info;
                      this.setData({
                        info: result.data.data.info,
                        avatarUrl: result.data.data.info.icon
                      })
                    }
                  }
                })
              }
            })
          }
        }
      })
    }else{
      console.log(e);
      
    }
  },
  toAddr() {
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      return;
    }
    wx.navigateTo({
      url: '../addr/addr',
    })
  },
  toOrder(e) {
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      return;
    }
    wx.navigateTo({
      url: '../order/order?state=' + e.currentTarget.dataset.state,
    })
  },
  toUser() {
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      return;
    }
    wx.navigateTo({
      url: '../user/user',
    })
  }
})