// pages/index/relevant_content.js
const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      content: "",
      http_host: app.globalData.http_host
  },
  saveBut: function(){
    var _this = this;
    util.requestData({
      url: app.globalData.http_host + 'index.php/Card/addRemark',
      data: {remark: _this.data.content},
      method:"POST",
      success:function(res){
        wx.showModal({
          title: '系统提示',
          content: res.msg,
          showCancel: false,
          success:function(){
            var page = getCurrentPages();
            var peve_page = page[page.length - 2];
            peve_page.setData({
              remark: _this.data.content,
              isLoading: true
            });
            wx.navigateBack();
          }
        })
      }
    })
  },
  all_input_val: function(e){
    if (e.target.dataset.key == "1") {
      this.setData({
        content: e.detail.value
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    util.requestData({
      url: app.globalData.http_host + 'index.php/Card/getRemark',
      success: function (data) {
        _this.setData({
          content: data.data.content
        })
      }
    })
  }
  
})