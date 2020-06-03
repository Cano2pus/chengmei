// pages/search/search.js
let data = {
  page: 1,
  size: 10
}
Page({
  data: {
    search: "",
    goodlist: [],
    history: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      history: wx.getStorageSync('searchHistory')
    })
    if(this.data.history == ""){
      this.setData({
        history: []
      })
    }
    
  },
  getList(_data){
    let that = this;
    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/goodList',
      data: _data,
      header: {
        'content-type': 'application/json'
      },
      success(res){
        that.setData({
          goodlist: res.data.data.data
        })
      }
    })
  },
  setSearch(e){
    this.setData({
      search: e.detail.value
    })
  },
  searchSubmit(){
    data.search = this.data.search;
    this.getList(data);

    // 搜索历史缓存
    let history = this.data.history;
    let index = history.findIndex(item => {
      return item == this.data.search;
    })
    if(index < 0){
      history.push(this.data.search)
      wx.setStorageSync('searchHistory', history);
    }
  },
  searchItem(e){
    this.setData({
      search: e.currentTarget.dataset.search
    })
    this.searchSubmit();
  },
  home(){
    wx.switchTab({
      url: '../index/index',
    })
  }
})