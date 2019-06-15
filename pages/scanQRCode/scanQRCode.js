//index.js
//获取应用实例
var handel = require('../../utils/handel.js');
var qqmapsdk;
Page({
  data: {
    loading: false,
  },

  onLoad: function () {

  },
  onReady() {
    // 调用接口

  },
  toFeedback() {//到异常反馈
    handel.getOpenIdToFeedback(this)
  },
  handelScanCode() {//获取用户当前地理位置后扫码
    handel.handelScanCode(this, 1)
  }
})
