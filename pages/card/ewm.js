// pages/card/ewm.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      http_host: app.globalData.http_host
  },
  getCode: function(){
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    util.requestData({
      url: app.globalData.http_host + 'index.php/Index/shareCard',
      success: function (data) {
        _this.setData({
          name: data.data.name,
          position: data.data.position,
          company_name: data.data.company_name,
          mobile: data.data.mobile,
          avatar_url: data.data.avatar_url
        });
      }
    });
    util.requestData({
      url: app.globalData.http_host + 'index.php/Index/getWXCode',
      success: function (data) {
        _this.setData({
          wxCode: data.data.url
        })
      }
    })
  
  }
})