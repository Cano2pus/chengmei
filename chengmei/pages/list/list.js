// pages/list/list.js
let data = {
  page: 1,
  size: 10
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: [],
    typeid: 0,
    goodlist: [],
    filter: 1,
    priceSort: ''
  },
  getList(_data){
    let that = this;
    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/goodList',
      method: "POST",
      data: _data,
      header: {
        'content-type': 'application/json'
      },
      success(res){
        let tmp = res.data.data.data;
        
        that.setData({
          goodlist: that.data.goodlist.concat(tmp)
        })
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: JSON.parse(options.type)
    })

    data.good_parent_type = this.data.type.good_type_id
    this.getList(data);
    
  },
  selectType(e){
    this.setData({
      typeid: e.currentTarget.dataset.typeid,
      goodlist: []
    })

    data.page = 1;
    data.good_type = e.currentTarget.dataset.typeid
    this.getList(data);

  },
  selectAll(){
    this.setData({
      typeid: 0,
      goodlist: []
    })

    data.page = 1;
    delete data.good_type;
    this.getList(data);
  },
  onReachBottom: function () {

    data.page++;
    this.getList(data);

  },
  setfilter(e){

    this.setData({
      filter: e.currentTarget.dataset.i,
      goodlist: []
    })

    data.page = 1;
    if(this.data.filter == 1){
      if(data.hasOwnProperty('add_time')){
        delete data.add_time;
      }
      if(data.hasOwnProperty("price")){
        delete data.price;
      }
      this.setData({
        priceSort: ""
      })
    }else if(this.data.filter == 2){
      data.add_time = 1;
      if(data.hasOwnProperty('price')){
        delete data.price;
      }
      this.setData({
        priceSort: ""
      })
    }else{
      if(data.hasOwnProperty('add_time')){
        delete data.add_time;
      }
      if(this.data.priceSort == "asc" || this.data.priceSort == ""){
        this.setData({
          priceSort: "desc"
        })
      }else{
        this.setData({
          priceSort: "asc"
        })
      }
      data.price = this.data.priceSort;
    }
    this.getList(data);

  },
  todetail(e){
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.item.good_id,
    })
  }
})