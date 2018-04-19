// pages/my/my.js
const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      http_host: app.globalData.http_host
  },
  goToViewList1: function (e) { 
    wx.navigateTo({
      url: '../my/history_list?type=' + 1,
    })
  },
  goToViewList2: function (e) {
    wx.navigateTo({
      url: '../my/history_list?type=' + 2,
    })
  },
  goToViewList3: function (e) {
    wx.navigateTo({
      url: '../my/history_list?type=' + 3,
    })
  },
  goToMessageList: function () { 
    wx.navigateTo({
      url: '../my/message',
    })
  },
  goToEdit: function () {
    wx.navigateTo({
      url: '../index/create_card',
    })
  },
  onShow: function(){
    if (!this.data.isLoading){
      this.pageLoading();
    }  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageLoading();
  },
  pageLoading: function(){
    this.data.isLoading = true;
    var _this = this;
    util.requestData({
      url: app.globalData.http_host + 'index.php/Member',
      success: function (data) {
        _this.data.isLoading = false;
        _this.setData({
          nick_name: data.data.nick_name,
          avatar_url: data.data.avatar_url,
          view_count: data.data.view_count,
          thumb_up_count: data.data.thumb_up_count,
          collect_count: data.data.collect_count,
          message_count: data.data.message_count,
          is_card: data.data.is_card
        })
      }
    })
  }
})