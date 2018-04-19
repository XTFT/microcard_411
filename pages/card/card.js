// pages/card/card.js
const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allList: [],
    http_host: app.globalData.http_host
  },
  allInputBlur: function(e){
    var _this = this;
    var keyword = e.detail.value;
    if(keyword.length <= 0){
      _this.setData({
        isInputShow: false
      });
    }   
  },
  allInputFocus: function (e) {
    var _this = this;
    _this.setData({
      isInputShow: true
    });
  },
  allInputVal: function (e) {
    var _this = this;

    var keyword = e.detail.value;
    var cardList = this.data.allList;
    var newCardList = [];
    var newItemList = []
    for (var i = 0; i < cardList.length; i++) {
      newItemList = [];
      for (var j = 0; j < cardList[i].item.length; j++) {
        var item = cardList[i].item[j];
        if (item['name'].indexOf(keyword) > -1 || item['phone'].indexOf(keyword) > -1) {
          newItemList.push(item);
        }
      }
      if (newItemList.length > 0) {
        newCardList.push({ 'key': cardList[i].key, 'item': newItemList })
      }
    }
    if (newCardList.length > 0) {
      _this.setData({
        list: newCardList,
        isShow: true
      })
    } else {
      _this.setData({
        isShow: false
      })
    }

  },
  clickCall: function (e) {
    var mobile = e.target.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
    return false;
  },
  getCardInfo: function (e) {
    var id = e.currentTarget.dataset.key;
    console.log(id);
    wx.navigateTo({
      url: 'p_card?member_id=' + id,
    })
  },
  onShow: function(){
    if (this.data.isLoding == false){
      var _this = this;
      util.requestData({
        url: app.globalData.http_host + 'index.php/Member/getCardClipList',
        success: function (data) {
          if (data.data && data.data.length > 0) {
            _this.data.allList = data.data
            _this.setData({
              list: data.data,
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.isLoding = true;
    var _this = this;
    _this.setData({
      isInputShow: false
    })
    util.requestData({
      url: app.globalData.http_host + 'index.php/Member/getCardClipList',
      success: function (data) {
        _this.data.isLoding = false;
        if (data.data && data.data.length > 0) {
          _this.data.allList = data.data
          _this.setData({
            list: data.data,
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