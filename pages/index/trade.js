// pages/index/trade.js
const app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    http_host: app.globalData.http_host,
    list: []
  },

  levelFun: function (e) {
    var _this = this;
    var id = e.target.dataset.key;
    for(var i = 0; i < _this.data.list.length; i++){
      if(_this.data.list[i].id == id){
        _this.data.list[i].current = 1;
      }else{
        _this.data.list[i].current = 0;
      }
    }
    _this.setData({
      list: _this.data.list
    });
  },
  itemFun:function(e){
    var id = e.target.dataset.key;
    var name = e.target.dataset.name;
    var page = getCurrentPages();
    var peve_page = page[page.length - 2];
    peve_page.setData({
      industry_id: id,
      industry_name: name,
      isLoading:true
    });
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    util.requestData({
      url: app.globalData.http_host + 'index.php/Index/getIndustry',
      success: function (res) {
        _this.data.list = res.data;     
        _this.setData({
          list: res.data
        });
      }
    });
  }
})