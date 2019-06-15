// pages/teaPlantation/teaPlantation.js
var handel = require('../../utils/handel.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    num: 0,
    starNum: [],
    teaData: { },
    imgUrl: handel.urlHeader +'/images/686585335563057163.png',
    plot_id:'',
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStar();
    const _this=this;
    handel.handelRequest(_this,{
      url: "/garden/detail",
      data: {
        garden_id:my.getStorageSync({key:"garden_id"}).data ||'',
        plot_id:my.getStorageSync({key:"plot_id"}).data ||''
      }
    }, function (res) {
      _this.setData({
        loading:false,
        teaData:res
      })
    })
  },
  getStar() {
    let arr = [];
   /*  const len = parseInt(this.data.teaData.star); */
    for (let i = 0; i < 5; i++) {
     // console.log(i);
      arr.push(i);
    }
    this.setData({
      starNum: arr
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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