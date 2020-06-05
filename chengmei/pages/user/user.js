// pages/user/user.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      info: app.globalData.userInfo
    })
  },
  selectPic() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.uploadFile({
          filePath: res.tempFilePaths[0],
          name: 'img',
          url: 'http://chengmei_dev.wanxikeji.cn/api/savePic',
          success: (resp) => {
            console.log(resp);
            
            wx.request({
              url: 'http://chengmei_dev.wanxikeji.cn/api/userModify',
              method: "POST",
              data: {
                token: app.globalData.userInfo.token,
                field: "icon",
                value: 'http://chengmei_dev.wanxikeji.cn/' + JSON.parse(resp.data).data
              },
              header: {
                'content-type': 'application/json'
              },
              success(res2) {
                wx.showToast({
                  title: res2.data.msg,
                  icon: "none"
                });
    
                if(res2.data.code == 2000){
                  app.globalData.userInfo.icon = 'http://chengmei_dev.wanxikeji.cn/' + JSON.parse(resp.data).data;
                  that.setData({
                    info: app.globalData.userInfo
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  editNickName() {
    wx.navigateTo({
      url: '../useredit/useredit?field=nick_name',
    })
  },
  editPhone() {
    wx.navigateTo({
      url: '../useredit/useredit?field=phone',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      info: app.globalData.userInfo
    })
  },
})