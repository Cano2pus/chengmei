// pages/search/search.js
Page({
  data: {
    search: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },
  setSearch(e){
    console.log(e.detail.value);
    
  }
})