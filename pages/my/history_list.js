// pages/index/history_list.js
const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
        http_host: app.globalData.http_host
  },
  goToCard: function (e) {
    var id = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../card/p_card?member_id=' + id,
    })
  },
  onShow:function(){
    if (!this.data.isLoading){
      if(this.data.type >0){}else{
        this.data.type = wx.getStorageSync('history_type');
      }
      this.pageLoading();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title = '';
    if (options.type == 1){
      title = "谁赞过我";
    }else if(options.type == 2){
      title = "谁收藏过我";
    }else{
      title = "谁看过我";
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    this.data.type = options.type;
    wx.setStorageSync('history_type', options.type);
    this.pageLoading();
  },
  pageLoading: function(){
    this.data.isLoading = true;
    var _this = this;    
    util.requestData({
      url: app.globalData.http_host + 'index.php/Member/getCardRecords',      
      data: { type: this.data.type },
      success: function (data) {
        this.data.isLoading = false;
        if (data.data.list && data.data.list.length > 0) {
          _this.setData({
            list: data.data.list,
            isShowTip: data.data.isShowTip,
            isShow: true
          })
        } else {
          _this.setData({
            isShow: false
          })
        }
      }
    })
  }
})