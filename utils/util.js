const app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const requestData = function (n) {
  if (app.globalData.token == '' || app.globalData.token == null){
    app.globalData.token = wx.getStorageSync('token');
  }
 
  if(!n.data){
    n.data = {};
    n.data.token = app.globalData.token;
  }else{
    n.data.token = app.globalData.token;
  }
  n.data._t = new Date().getTime();
  wx.request({
    url: n.url,
    data: n.data,
    method: n.method,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {     
      if (res.data.result == 1) {
        if (typeof n.success == "function") {
          n.success(res.data);
        }
      } else if (res.data.result == 400) {
        console.log(400);
        //app.onLaunch(1);
        //调转login
      } else {
        //提示错误 加返回
        if (typeof n.fail == "function") {
          n.fail(res);
         }            
      }
    }

  })
}

const requestAddPV = function(_type){
  requestData({
    url: app.globalData.http_host + 'index.php/Index/addPV',
    data: {type: _type},
    method: 'POST',
    success: function(){

    }
  })
}

Array.prototype.indexOf = function(obj){
  for(var i = 0; i < this.length; i++){
    if(this[i] == obj){
      return i;
    }
  }
  return -1;
}



module.exports = {
  formatTime: formatTime,
  requestData: requestData,
  requestAddPV: requestAddPV
}

