// pages/feedback/feedback.js
var handel = require('../../utils/handel.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedbackData: [],
    slideDownInd:0,
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getFeedbackInfo();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  getFeedbackInfo(){//获取反馈信息数据
    const _this=this;
    handel.handelRequest(_this,{
      url: "/originfedback/list",
      data: {
        openId: my.getStorageSync({key:'openId'}).data||''
      }
    }, function (res) {
      my.hideNavigationBarLoading()
      _this.setData({
        feedbackData:res.data,
        loading:false
      })
    })
  },
  slideToggle(e){
    console.log(e);
    const ind = e.currentTarget.dataset.index;
    if (this.data.slideDownInd > -1 && (this.data.slideDownInd==ind)){
      this.setData({
        slideDownInd: -1
      })
    }else{
      this.setData({
        slideDownInd: ind
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    showNavigationBarLoading()
    stopPullDownRefresh()
    this.setData({
      loading: true
    })
    this.onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})