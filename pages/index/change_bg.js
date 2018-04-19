// pages/index/change_bg.js
const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      images: [],
      http_host: app.globalData.http_host
  },
  selImg:function(e){
    var file = e.target.dataset.file;
    var url = e.target.dataset.url;
    var page = getCurrentPages();
    var peve_page = page[page.length-2];
    
    peve_page.setData({
      bg_url: file,
      htt_bg_url: url,
      isLoading: true
    });
    wx.navigateBack();
  },
  closeBg: function(e){
    var _this = this;
    var id = e.target.dataset.id;
    wx.showModal({
      title: '系统提示',
      content: '你确定要删除吗？',
      success:function(res){
        if (res.confirm){
          util.requestData({
            url: app.globalData.http_host + 'index.php/Card/deleteBgImg',
            data: { id: id },
            method: 'POST',
            success: function (res) {
              for (var i = 0; i < _this.data.images.length; i++) {
                if (_this.data.images[i].id == id){
                  _this.data.images.splice(i, 1);
                  break;
                }               
              }              
              _this.setData({
                imgs: _this.data.images
              });
              wx.setStorage({
                key: 'uploadCardBg',
                data: JSON.stringify(_this.data.images),
              })
            }
          })
        }        
      }
    })
  },
  upload_img:function(){
    var _this = this;
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.globalData.http_host + 'index.php/Card/uploadBgImg',
          filePath: tempFilePaths[0],
          name:'file',
          formData:{
            'token': app.globalData.token
          },
          success:function(res){
            var data = JSON.parse(res.data);
            _this.data.images = data.data;
            _this.setData({
              imgs: data.data
            })
            wx.setStorage({
              key: 'uploadCardBg',
              data: JSON.stringify(_this.data.images),
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    var _this = this;  
    wx.getStorageInfo({
      success: function (res) {
        if (res.keys.length || res.keys.indexOf('uploadCardBg') > -1) {
          wx.getStorage({
            key: 'uploadCardBg',
            success: function (res1) {
              _this.data.images = JSON.parse(res1.data);
              console.log(_this.data.images );
              _this.setData({
                imgs: _this.data.images
              });
            }
          })
        } else {
          util.requestData({
            url: app.globalData.http_host + 'index.php/Card/getCardBgImgList',
            success: function (res) {
              _this.data.images = res.data;
              _this.setData({
                imgs: res.data
              });
              wx.setStorage({
                key: 'uploadCardBg',
                data: JSON.stringify(res.data)
              })
            }
          });
        }
      }
    })

  }
})