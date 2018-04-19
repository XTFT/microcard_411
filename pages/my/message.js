// pages/my/message.js
const app = getApp();
const util = require('../../utils/util.js');
const WxEmoji = require('../../WxEmojiView/WxEmojiView.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form_member_id: '',
    parent_id: '',
    content: '',
    focus: false,
    val: '',
    lists: [],
    af_value: '',
    is_s_css: false,
    is_bq: false,
    item_bq: '',
    is_showbq: false,
    http_host: app.globalData.http_host,
    isShowBQ: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  show_bq: function () {
    this.data.isShowBQ = true;
    if (!this.data.is_showbq) {
      this.setData({
        is_showbq: true,
        is_bq: true
      });
    } else {
      this.setData({
        is_showbq: true,
        is_bq: false,
        focus: true
      });
    }

  },
  hf_msg: function (e) {
    var id = e.target.dataset.key;
    var _this = this;
    _this.setData({
      parent_id: id,
      focus: true
    });
  },
  send: function (e) {
    var _this = this;
    if (this.data.val.length > 0) {
      var pid = _this.data.parent_id;
      if (pid == "") {
        pid = 0;
      }
      var _data = {
        form_member_id: _this.data.form_member_id,
        parent_id: pid,
        content: _this.data.val
      }
      var this_data = {
        url: app.globalData.http_host + 'index.php/Member/addMessage',
        data: _data,
        method: 'post',
        success: function (res) {
          _this.request_data(_this.data.form_member_id);
          _this.setData({
            val: '',
            parent_id: ''
          });
        }
      };
      util.requestData(this_data);
    } else {
      wx.showToast({
        title: '请输入留言内容',
        icon: 'loading',
        mask: true
      })
    }
  },
  onLoad: function (options) {
    var e_data = {};
    var em_data = [];
    var num;
    for (var i = 0; i < 100; i++) {
      if (i.toString().length < 2) {
        num = "0" + i;
      } else {
        num = i;
      }
      em_data.push({ id: i, img: num });
    }
    WxEmoji.init(":_/", em_data);
    var _this = this;
    var id = options.member_id;
    if (id == undefined) {
      id = '';
    }
    _this.request_data(id);
    WxEmoji.bindThis(_this);
  },
  request_data(id) {
    var _this = this;
    var this_data = {
      url: app.globalData.http_host + 'index.php/Member/getCardMessageList',
      data: { member_id: id },
      method: 'get',
      success: function (res) {
        if (res.data.list && res.data.list.length > 0) {
          var lists = res.data.list;
          _this.setData({
            lists: lists,
            form_member_id: res.data.for_member_id,
            isShow: true,
            isSend: 0
          });
        } else {
          _this.setData({
            isShow: false,
            form_member_id: res.data.for_member_id,
            isSend: 0
          })
        }
      }
    };
    util.requestData(this_data);
  },
  wxPreEmojiTap: function (e) {
    var _this = this;
    WxEmoji.wxPreEmojiTap(_this, e);

  },
  input_focus: function (e) {
    this.data.isShowBQ = false;
    var val = e.detail.value;
    var _this = this;
    _this.setData({
      is_showbq:false,
      isSend: 1
    });
  },
  input_blur: function (e) {
    var _this = this;
    setTimeout(function(){
      if (!_this.data.isShowBQ){
        _this.setData({
          is_showbq: false,
          is_bq: false,
          isSend: 0
        });
      }else{
        _this.data.isShowBQ = false;
      }
    }, 50)
   
  },
  content: function (e) {
    var _this = this;
    var a_val;
    var after_val = e.detail.value.toString();
    if (after_val.length < _this.data.val.length) {
      for (var i = 0; i < _this.data.val.length; i++) {
        if (after_val[i] == _this.data.val[i] && _this.data.val[i] == "[") {
          if (after_val[i + 3] !== _this.data.val[i + 3] || after_val[i + 2] !== _this.data.val[i + 2] || after_val[i + 1] !== _this.data.val[i + 1]) {
            var n = i + 3;
            if (n == after_val.length) {
              a_val = after_val.substring(0, i);
            } else {
              a_val = after_val.substring(0, i) + after_val.substring(i + 3, after_val.length);
            }
            _this.setData({
              val: a_val
            });
            return;
          }
        } else {
          if (_this.data.val[i] == "[") {
            var n = i + 3;
            if (n == after_val.length) {
              a_val = after_val.substring(0, i);
            } else {
              a_val = after_val.substring(0, i) + after_val.substring(i + 3, after_val.length);
            }
            _this.setData({
              val: a_val
            });
            return;
          }
        }
      }
    } else {
      _this.setData({
        val: after_val
      });
    }
  }
})

