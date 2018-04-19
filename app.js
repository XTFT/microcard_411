App({
  globalData: {
    http_host: 'https://admin.mumo028.com/mini_program/microcard/web/',
    customer_id: 41,
    setting_id: 1,
    userInfo: null,
    token: ''
  },
  onLaunch: function (options) {
    if (options == null) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法部分功能，请升级到最新微信版本后重试。'
      })
    }
    
  },
  userAuthorizeFun: function(){
    var _this = this;
    // 获取用户信息
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框              
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId

                  _this.globalData.userInfo = res.userInfo
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (_this.userInfoReadyCallback) {
                    _this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }
        })
      },
      fail: function () {
        console.log(1);
        const util = require('utils/util.js');
        wx.request({
          url: _this.globalData.http_host + 'index.php/Login/login',
          data: {
            customer_id: _this.globalData.customer_id,
            setting_id: _this.globalData.setting_id
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (data) {
            _this.globalData.token = data.data.token;
            wx.setStorageSync('token', data.data.token);
            util.requestAddPV(1);
            console.log(2000);
            _this.logoReadyCallback();           
          }
        });

      }
    })
  },
  userInfoReadyCallback: function (res1) {
    var _this = this;
    const util = require('utils/util.js');
    // 登录
    wx.login({
      success: res => {
        wx.request({
          url: _this.globalData.http_host + 'index.php/Login/login',
          data: {
            code: res.code,
            customer_id: _this.globalData.customer_id,
            setting_id: _this.globalData.setting_id,
            nickName: res1.userInfo.nickName,
            gender: res1.userInfo.gender,
            avatarUrl: res1.userInfo.avatarUrl,
            province: res1.userInfo.province,
            city: res1.userInfo.city,
            country: res1.userInfo.country
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (data) {
            console.log(11);
            if (data.data.result == 1) {
              _this.globalData.token = data.data.token;
              wx.setStorageSync('token', data.data.token);
              util.requestAddPV(1);
              console.log(2001);
              _this.logoReadyCallback();             
            } else {
              wx.showModal({
                title: '提示',
                content: '获取信息错误。'
              })
            }
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
  }
})