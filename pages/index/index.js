//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data:{
      http_host: app.globalData.http_host
  },
  create_cart: function () {
    wx.navigateTo({
      url: '../index/create_card'
    })
  },
  goToMessage: function(){
    wx.navigateTo({
      url: 'message',
    })
  },
  getShare: function () {
    wx.navigateTo({
      url: '../card/ewm',
    })
  },
  clickCall: function (e) {
    var mobile = this.data.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
    return false;
  },
  goToLocation:function(){
    var _this = this;
    wx.openLocation({
      latitude: parseFloat(_this.data.latitude),
      longitude: parseFloat(_this.data.longitude),
      name: _this.data.company_address,
      scale: 28
    })

    /*wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: _this.data.company_address,
          scale: 28
        })
      }
    })*/
  },
  getMemberCard: function (e) {
    var member_id = e.target.dataset.key;
    wx.navigateTo({
      url: '../card/p_card?member_id=' + member_id,
    })
  },
  onShareAppMessage: function (res) {  
    if (this.data.isAddCard){
      return {
        title: this.data.recommended_name + '向您推荐了' + this.data.name,
        path: 'pages/card/p_card?member_id=' + this.data.member_id,
        imageUrl: '',
        success: function(){
          util.requestAddPV(2);
        }
      }
    }else{
      return {
        title: '微名片',
        path: 'pages/index/index',
        imageUrl: '',
        success: function () {
          util.requestAddPV(2);
        }
      }
    }   
  },
  onShow:function(){
    if (app.globalData.token != '') {
      this.pageLoading();
    }  
  },
  onReachBottom:function(){
    this.pageLoading();
  },
  onLoad: function () {
    wx.showLoading({
      title: '',
    })
    var _this = this;
    if (app.globalData.token ==''){
      console.log(20003);
      app.logoReadyCallback = function () {
        _this.pageLoading();
      }
      app.userAuthorizeFun();
     
    }else{
      console.log(20004);
      app.logoReadyCallback = function(){};
      _this.pageLoading();
    }
   
  },
  pageLoading: function(){
    console.log(2);
    var _this = this;
    util.requestData({
      url: app.globalData.http_host + 'index.php/Index/isExistCard',
      success: function (data) {
        util.requestData({
          url: app.globalData.http_host + 'index.php/Index',
          success: function (data) {
            wx.hideLoading();
            _this.setData({
              isAddCard: true,
              isShow1: 'hide',
              isShow: 'show',
              name: data.data.name,
              position: data.data.position,
              mobile: data.data.mobile,
              company_name: data.data.company_name,
              company_address: data.data.company_address,
              thumb_up_count: data.data.thumb_up_count,
              collect_count: data.data.collect_count,
              message_count: data.data.message_count,
              view_count: data.data.view_count,
              remark: data.data.remark,
              avatar_url: data.data.avatar_url,
              records: data.data.records,
              bg_url: data.data.bg_url,
              member_id: data.data.member_id,
              recommended_name: data.data.recommended_name,
              latitude: data.data.latitude,
              longitude: data.data.longitude
            });
          }
        })
      },
      fail: function (data) {
        wx.hideLoading();
        _this.setData({
          isAddCard: false,
          isShow1: 'show',
          isShow: 'hide'
        });
      }
    });

   
  },
  onReady: function () {

  }
})
