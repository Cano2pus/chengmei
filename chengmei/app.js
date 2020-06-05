//app.js
App({
  onLaunch: function () {
    let that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'http://chengmei_dev.wanxikeji.cn/api/useCodeGetOpenId',
          method: "POST",
          data: {
            code: res.code
          },
          header: {
            "content-type": "appliction/json"
          },
          success(result){
            wx.setStorageSync('openid', result.data.data.openid);
            if(result.data.data.info){
              that.globalData.userInfo = result.data.data.info
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
  
})