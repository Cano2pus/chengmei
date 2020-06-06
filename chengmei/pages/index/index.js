//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
      banner: [],
      type: [],
      list: []
  },
  onLoad(){
    const that = this;
    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/bannerList',
      header: {
        'content-type': 'application/json'
      },
      success(res){
        that.setData({
          banner: res.data.data
        })
      }
    })

    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/goodType',
      header: {
        'content-type': 'application/json'
      },
      success(res){
        that.setData({
          type: that.handleType(res.data.data, 0)
        })
        wx.setStorageSync('type', JSON.stringify(that.data.type));
      }
    })

    wx.request({
      url: 'http://chengmei_dev.wanxikeji.cn/api/goodListHome',
      header: {
        'content-type': 'application/json'
      },
      success(res){
        that.setData({
          list: that.handleList(res.data.data)
        })
      }
    })
  },
  searchbtn(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // 整理分类
  handleType(list, id){
    let tmp = [];
    for(let i = 0; i < list.length; i++){
      if(list[i].parent_id == id){
        list[i].children = this.handleType(list, list[i].good_type_id);
        tmp.push(list[i]);
      }
    }
    return tmp;
  },
  // 整理首页商品列表
  handleList(val){
    let tmp = [];
    for(let i = 0; i < val.length; i++){
      let index = tmp.findIndex(item => {
        return item.name == val[i].good_type;
      })
      if(index < 0){
        tmp.push({
          name: val[i].good_type,
          type_id: val[i].type_parent_id,
          children: [val[i]]
        });
      }else{
        tmp[index].children.push(val[i]);
      }
    }
    return tmp;
  },
  todetail(e){
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.item.good_id,
    })
  },
  tolist(e){
    wx.navigateTo({
      url: '../list/list?typeid=' + JSON.stringify(e.currentTarget.dataset.classify)
    })
  }
})
