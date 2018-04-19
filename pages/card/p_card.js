// pages/card/p_card.js
const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    http_host: app.globalData.http_host,
    animationData: {},
    animationData1: {},
    forMemberID: 0,
    isLoading: true
  },
  goToIndex: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  goToMeaage: function () {
    wx.navigateTo({
      url: '../index/message?member_id=' + this.data.forMemberID,
    }) 
  },
  goToLocation: function () {
    var _this = this;
    wx.openLocation({
      latitude: parseFloat(_this.data.latitude),
      longitude: parseFloat(_this.data.longitude),
      name: _this.data.company_address,
      scale: 28
    })
  },
  clickCall: function (e) {
    var mobile = this.data.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  goAddressBook: function () { 
    var _this = this;   
    wx.downloadFile({
      url: _this.data.avatar_url,
      success: function (res) {
        wx.addPhoneContact({
          photoFilePath: res.tempFilePath,
          firstName: _this.data.name,
          mobilePhoneNumber: _this.data.mobile,
          organization: _this.data.company_name,
          title: _this.data.position,
          addressStreet: _this.data.company_address
        })
      },
      fail:function(){
        wx.addPhoneContact({
          firstName: _this.data.name,
          mobilePhoneNumber: _this.data.mobile,
          organization: _this.data.company_name,
          title: _this.data.position,
          addressStreet: _this.data.company_address,
          fail: function (detail){
            wx.showToast({
              title: detail,
            })
          }
        })
      }
    })

  },
  clickCollect: function () {
    var _this = this;
    if (_this.data.is_collect) {
      _this.delCardRecords(2, function () {
        _this.data.collect_count = parseInt(_this.data.collect_count) - 1
        if (_this.data.collect_count <= 0) {
          _this.data.collect_count = 0;
        }
        _this.setData({
          is_collect: false,
          collect_count: _this.data.collect_count
        });
      });
    } else {
      _this.addCardRecords(2, function () {
        var animation1 = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease',
        })
        _this.animation1 = animation1;
        _this.setData({
          isShow1: true,
          is_collect: true,
          collect_count: parseInt(_this.data.collect_count) + 1
        })
        setTimeout(function () {
          animation1.scale(2, 2).translate(10, -10).step()
          setTimeout(function () {
            _this.setData({
              animationData1: animation1.export()
            })
          }, 1);
          setTimeout(function () {
            _this.setData({
              isShow1: false
            });
            animation1.scale(1, 1).translate(0, 10).step();
            _this.setData({
              animationData1: animation1.export()
            })
          }, 600)
        }, 10);
      })
    }
  },
  clickThumbUp: function () {
    var _this = this;
    if (_this.data.is_thumb_up) {
      _this.delCardRecords(1, function () {
        _this.data.thumb_up_count = parseInt(_this.data.thumb_up_count) - 1
        if (_this.data.thumb_up_count <= 0){
          _this.data.thumb_up_count = 0;
        }
        _this.setData({
          is_thumb_up: false,
          thumb_up_count: _this.data.thumb_up_count
        });
      });
    } else {
      _this.addCardRecords(1, function () {
        var animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease',
        })
        _this.animation = animation;
        _this.setData({
          isShow: true,
          is_thumb_up: true,
          thumb_up_count: parseInt(_this.data.thumb_up_count) + 1
        });
        setTimeout(function () {
          animation.scale(2, 2).translate(10, -10).step()
          setTimeout(function () {
            _this.setData({
              animationData: animation.export()
            })
          }, 1);
          setTimeout(function () {
            _this.setData({
              isShow: false
            });
            animation.scale(1, 1).translate(0, 10).step();
            _this.setData({
              animationData: animation.export()
            })
          }, 600)
        }, 10)
      })
    }
  },
  addCardRecords: function (typeKey, callback) {
    var _this = this;
    util.requestData({
      url: app.globalData.http_host + 'index.php/Member/addCardRecords',
      data: { type: typeKey, for_member_id: _this.data.forMemberID },
      method: 'POST',
      success: function (data) {
        if (typeof callback == "function") {
          callback();
        }
      }
    });
  },
  delCardRecords: function (typeKey, callback) {
    var _this = this;
    util.requestData({
      url: app.globalData.http_host + 'index.php/Member/delCardRecords',
      data: { type: typeKey, for_member_id: _this.data.forMemberID },
      method: 'POST',
      success: function (data) {
        if (typeof callback == "function") {
          callback();
        }
      }
    });
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.recommended_name + '向您推荐了' + this.data.name,
      path: '/pages/card/p_card?member_id=' + this.data.forMemberID,
      imageUrl: '',
      success: function () {
        util.requestAddPV(2);
      }
    }
  },
  onShow: function (options) {
    if (!this.data.isLoading){
      if (this.data.forMemberID > 0) { } else {
        this.data.forMemberID = wx.getStorageSync('forMemberID');
      }
      this.pageLoading({ member_id: this.data.forMemberID });
    }    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (app.globalData.token == '') {
      app.logoReadyCallback = function () {
        _this.pageLoading(options);
      }
      app.userAuthorizeFun();     
    } else {
      app.logoReadyCallback = function () { };
      _this.pageLoading(options);
    }
  },
  pageLoading(options) {

    var _this = this;
    var id = options.member_id;
    _this.data.forMemberID = id;
    console.log(id);
    wx.setStorageSync('formMemberID', id);
    util.requestData({
      url: app.globalData.http_host + 'index.php/Index',
      data: { id: id },
      success: function (data) {
        _this.data.isLoading = false;
        wx.hideLoading();
        _this.setData({
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
          is_thumb_up: data.data.is_thumb_up,
          is_collect: data.data.is_collect,
          member_id: data.data.member_id,
          recommended_name: data.data.recommended_name,
          isShow: false,
          latitude: data.data.latitude,
          longitude: data.data.longitude
        });
      },
      fail: function (data) {
        wx.showModal({
          title: '系统提示',
          content: '该好友未创建名片。',
          showCancel: false,
          success: function () {
            wx.switchTab({
                url: '../index/index',
            })
          }
        })
      }
    });
  }
})