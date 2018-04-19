// pages/index/create_card.js
const app = getApp();
const util = require('../../utils/util.js')
Page({
    data: {
        old_phone: '',
        avatar_url: '',
        gender: '',
        name: '',
        phone: '',
        code: '',
        company_name: '',
        position: '',
        industry_id: '',
        industry_name: '',
        company_address: '',
        bg_url: '',
        htt_bg_url: '',
        boy_img: '',
        girl_img: '',
        an: {},
        done_save: 0,
        toast_text: '',
        is_show: false,
        http_host: app.globalData.http_host,
        isSend: true,
        sendCodeName: '发送验证码',
        isCheckCode: 0,
        isCode: false,
        isAuthorize: true
    },
    getSendCode: function () {
        if (this.data.isSend) {
            var _this = this;
            var mobile = _this.data.phone;
            if (!mobile || mobile.length <= 0) {
                wx.showToast({
                    title: '请输入手机号',
                    icon: 'loading',
                    mask: true
                });
                return false;
            } else {
                var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
                if (!myreg.test(mobile)) {
                    wx.showToast({
                        title: '输入的手机号格式有误',
                        icon: 'loading',
                        mask: true
                    });
                    return false;
                } else {
                    if (app.globalData.token == '' || app.globalData.token == null) {
                        app.globalData.token = wx.getStorageSync('token');
                    }

                    wx.request({
                        url: app.globalData.http_host + 'index.php/Card/sendCode',
                        data: {
                            token: app.globalData.token,
                            _t: new Date().getTime(),
                            mobile: mobile
                        },
                        method: 'POST',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        success: function (res) {
                            console.log(res);
                            if (res.data.result == 0) {
                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    showCancel: false,
                                    success: function (res) {
                                        if (res.confirm) {
                                            console.log('用户点击确定');
                                        } else if (res.cancel) {
                                            console.log('用户点击取消');
                                        }
                                    }
                                })
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: '发送成功',
                                    showCancel: false,
                                    success: function (res) {
                                        if (res.confirm) {
                                            console.log('用户点击确定');
                                        } else if (res.cancel) {
                                            console.log('用户点击取消');
                                        }
                                    }
                                })
                            }

                            _this.data.isSend = false;
                            var time = 60
                           var textc=setInterval(function () {
                                time--;
                                if (time <= 0) {
                                    _this.data.isSend = true;
                                    _this.data.sendCodeName = '发送验证码';
                                    clearInterval(textc)
                                    console.log('发送验证码')
                                    
                                } else {
                                    _this.data.sendCodeName = '剩余' + time + '秒';
                                    console.log(1)
                                }
                                _this.setData({
                                    sendCodeName: _this.data.sendCodeName
                                });
                            }, 1000)
                        }

                    })
                    
                }

            }
        }
    },
    getAddres: function () {
        var _this = this;
        wx.chooseLocation({
            success: function (res) {
                _this.data.company_address = res.address;
                _this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    company_address: res.address
                })
            },
            fail: function () {
                wx.authorize({
                    scope: 'scope.userLocation',
                    success() {

                    },
                    fail: function () {
                        wx.openSetting({
                            success: (res) => {
                                res.authSetting = {
                                    "scope.userLocation": true
                                }
                            }
                        })
                    }

                })
            }
        })
    },
    getBgImg: function () {
        wx.navigateTo({
            url: '../index/change_bg'
        });
    },
    hangye: function () {
        wx.navigateTo({
            url: '../index/trade',
        })
    },
    getRemark: function () {
        wx.navigateTo({
            url: '../index/relevant_content',
        })
    },
    all_input_val: function (e) {
        var _this = this;
        if (e.target.dataset.key == "1") {
            e.detail.value = e.detail.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
            _this.setData({
                name: e.detail.value
            });
        } else if (e.target.dataset.key == "2") {
            if (_this.data.isEdit == 1 && _this.data.is_mobile_code == 1) {
                if (_this.data.old_phone != e.detail.value) {
                    _this.setData({
                        isShowCode: 1
                    });
                } else {
                    _this.setData({
                        isShowCode: 0
                    });
                }
            }
            _this.setData({
                phone: e.detail.value
            });
        } else if (e.target.dataset.key == "3") {
            _this.data.isCheckCode = 0;
            _this.setData({
                code: e.detail.value
            });
        } else if (e.target.dataset.key == "4") {
            _this.setData({
                company_name: e.detail.value
            });
        } else if (e.target.dataset.key == "5") {
            _this.setData({
                position: e.detail.value
            });
        } else if (e.target.dataset.key == "6") {
            _this.setData({
                bg_url: e.detail.value
            })
        }
    },
    all_input_blur: function (e) {
    },
    b_g_img: function (e) {
        var sex = e.target.dataset.sex;
        var img, img1;
        var _this = this;
        if (sex == 1) {
            img = app.globalData.http_host + 'uploads/web/img/index/boy.png';
            img1 = app.globalData.http_host + 'uploads/web/img/index/girl_1.png'
        } else if (sex == 2) {
            img = app.globalData.http_host + 'uploads/web/img/index/boy_1.png';
            img1 = app.globalData.http_host + 'uploads/web/img/index/girl.png'
        }
        _this.setData({
            boy_img: img,
            girl_img: img1,
            gender: sex
        });
    },
    save_sure: function () {
        var _this = this;
        var text;
        _this.setData({
            done_save: 1,
            is_show: false
        });
        var c_save = _this.data.done_save;
        var _type = 0;
        var all_data = {
            name: _this.data.name,
            gender: _this.data.gender,
            phone: _this.data.phone,
            code: _this.data.code,
            company_name: _this.data.company_name,
            position: _this.data.position,
            company_address: _this.data.company_address,
            bg_url: _this.data.bg_url,
            industry_id: _this.data.industry_id,
            latitude: _this.data.latitude,
            longitude: _this.data.longitude,
        }
        if (c_save) {
            if (!all_data.name || all_data.name.length == 0) {
                c_save = 0;
                _type = 1;
            }
        }
        if (c_save) {
            if (!all_data.gender || all_data.gender.length == 0) {
                c_save = 0;
                _type = 2;
            }
        }
        if (c_save) {
            if (!all_data.phone || all_data.phone.length == 0) {
                c_save = 0;
                _type = 3;
            } else {
                var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
                if (!myreg.test(all_data.phone)) {
                    c_save = 0;
                    _type = 33;
                } else if (all_data.phone.length < 11) {
                    c_save = 0;
                    _type = 33;
                }
            }
        }
        if (_this.data.is_mobile_code && _this.data.isShowCode) {
            if (c_save) {
                if (!all_data.code || all_data.code.length == 0) {
                    c_save = 0;
                    _type = 4;
                }
            }
        }
        if (c_save) {
            if (!all_data.company_name || all_data.company_name.length == 0) {
                c_save = 0;
                _type = 5;
            }
        }
        if (c_save) {
            if (!all_data.position || all_data.position.length == 0) {
                c_save = 0;
                _type = 6;
            }
        }
        if (c_save) {
            if (!all_data.company_address || all_data.company_address.length == 0) {
                c_save = 0;
                _type = 7;
            }
        }
        if (c_save) {
            if (!all_data.bg_url || all_data.bg_url.length == 0) {
                c_save = 0;
                _type = 8;
            }
        }
        if (c_save) {
            if (!all_data.industry_id || all_data.industry_id.length == 0 || all_data.industry_id == "0") {
                c_save = 0;
                _type = 9;
            }
        }
        if (c_save) {
            var is_trun = 0;
            var this_data = {
                url: app.globalData.http_host + 'index.php/Card/add',
                data: all_data,
                method: 'POST',
                success: function (res) {
                    if (res.result == 1) {
                        wx.switchTab({
                            url: 'index',
                            success: function (e) {
                                var page = getCurrentPages();
                                page[page.length - 1].onLoad(1);
                            }
                        });
                    }
                },
                fail: function (e) {
                    wx.showToast({
                        title: e.data.msg,
                        icon: 'loading',
                        mask: true
                    });
                }
            };
            util.requestData(this_data);
        } else {
            if (_type == 1) {
                text = "请输入姓名"
            } else if (_type == 2) {
                text = "请选择性别"
            } else if (_type == 3) {
                text = "请输入电话"
            } else if (_type == 33) {
                text = "电话输入有误，请重新输入！"
            } else if (_type == 4) {
                text = "请输入验证码"
            } else if (_type == 5) {
                text = "请输入公司名称"
            } else if (_type == 6) {
                text = "请输入职务"
            } else if (_type == 7) {
                text = "请选择公司地址"
            } else if (_type == 8) {
                text = "请选择背景图"
            } else if (_type == 9) {
                text = "请选择行业"
            }
            wx.showToast({
                title: text,
                icon: 'loading',
                mask: true
            });
        }
    },
    onShow: function () {
        //if (!this.data.isLoading) {
        //this.pageLoading();
        // }
    },
    onLoad: function (options) {
        this.pageLoading();
    }
    ,
    pageLoading: function () {
        this.data.isLoading = true;
        var _this = this;
        wx.authorize({
            scope: 'scope.userInfo',
            success() {
                if (_this.data.isAuthorize) {
                    var this_data = {
                        url: app.globalData.http_host + 'index.php/Card',
                        success: function (res) {
                            console.log(1);
                            _this.data.isLoading = false;
                            var img, img1;
                            if (res.data.gender == 1) {
                                img = app.globalData.http_host + 'uploads/web/img/index/boy.png';
                                img1 = app.globalData.http_host + 'uploads/web/img/index/girl_1.png'
                            } else if (res.data.gender == 2) {
                                img = app.globalData.http_host + 'uploads/web/img/index/boy_1.png';
                                img1 = app.globalData.http_host + 'uploads/web/img/index/girl.png'
                            } else {
                                img = app.globalData.http_host + 'uploads/web/img/index/boy_1.png';
                                img1 = app.globalData.http_host + 'uploads/web/img/index/girl_1.png'
                            }

                            if (res.data.isEdit == 1) {
                                _this.data.old_phone = res.data.phone;
                            }
                            var isShowCode = 0;
                            if (res.data.is_mobile_code != 0 && !res.data.isEdit) {
                                isShowCode = 1;
                            }

                            _this.setData({
                                avatar_url: res.data.avatar_url,
                                gender: res.data.gender,
                                bg_url: res.data.bg_url,
                                htt_bg_url: res.data.htt_bg_url,
                                company_address: res.data.company_address == '' ? '请输入公司地址' : res.data.company_address,
                                company_name: res.data.company_name,
                                industry_id: res.data.industry_id,
                                industry_name: res.data.industry_name,
                                name: res.data.name,
                                phone: res.data.phone,
                                position: res.data.position,
                                boy_img: img,
                                girl_img: img1,
                                is_mobile_code: res.data.is_mobile_code,
                                isEdit: res.data.isEdit,
                                remark: res.data.remark,
                                isShowCode: isShowCode
                            });
                        }
                    };
                    util.requestData(this_data);
                } else {
                    wx.getSetting({
                        success: res => {
                            if (res.authSetting['scope.userInfo']) {
                                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框              
                                wx.getUserInfo({
                                    success: res => {
                                        // 可以将 res 发送给后台解码出 unionId

                                        // _this.globalData.userInfo = res.userInfo
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
                }
            },
            fail: function () {
                wx.showModal({
                    content: '用户尚未授权该操作，请开启授权',
                    showCancel: false,
                    success: function () {
                        wx.openSetting({
                            success: (res) => {
                                res.authSetting = {
                                    "scope.userInfo": true
                                }
                            },
                            complete: function () {
                                _this.data.isAuthorize = false;
                                _this.pageLoading();
                            }
                        })
                    }
                })
            }
        });
    },
    userInfoReadyCallback: function (res1) {
        var _this = this;
        wx.login({
            success: res => {
                wx.request({
                    url: app.globalData.http_host + 'index.php/Login/login',
                    data: {
                        token: app.globalData.token,
                        code: res.code,
                        customer_id: app.globalData.customer_id,
                        setting_id: app.globalData.setting_id,
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
                        app.globalData.token = data.data.token;
                        _this.data.isAuthorize = true;
                        _this.pageLoading();
                    }
                })
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        });
    }
});