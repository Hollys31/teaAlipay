// pages/video/video.js
var handel = require('../../utils/handel.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    tabbar: {},
    isLoading: true,
    currMonth: 3,//当前月份
    currType: 1,//当前视频类型
    pageHidden: true,
    videoType: [{ 'type': '0', 'name': '全景视频' }, { 'type': '1', 'name': '直播' }, { 'type': '2', 'name': '小视频' }],
    playIndex: -1,//当前播放视频索引值
    autoplay: false,

    panoNum: 1,
    liveData: [],
    videoData: [
     /*  { "address": "福建省南平市武夷山市星村镇黄村西北方向约1.97公里", "update_time": "2019-03-28 ", "video_url": "https://xair-iot-data.oss-cn-hangzhou.aliyuncs.com/2019/3/20/W867012033408110_1553105157290359860.mp4", "plot_name": "智慧茗园精品山场" },
      { "address": "福建省南平市武夷山市星村镇黄村西北方向约1.97公里", "update_time": "2019-03-27", "video_url": "https://xair-iot-data.oss-cn-hangzhou.aliyuncs.com/2019/3/24/W867012033408110_1553447512942752305.mp4", "plot_name": "智慧茗园精品山场" },
      { "address": "福建省南平市武夷山市星村镇黄村西北方向约1.97公里", "update_time": "2019-03-26 ", "video_url": "https://xair-iot-data.oss-cn-hangzhou.aliyuncs.com/2019/3/22/W867012033408110_1553276179035044076.mp4", "plot_name": "智慧茗园精品山场" },
      { "address": "福建省南平市武夷山市星村镇黄村西北方向约1.97公里", "update_time": "2019-03-25 ", "video_url": "https://xair-iot-data.oss-cn-hangzhou.aliyuncs.com/2019/3/21/W867012033408110_1553191540068422764.mp4", "plot_name": "智慧茗园精品山场" } */],
    currentPage: 1,
    isReload: 0,
    panoUrl: 'https://tea.yufengtek.com/tea_Sprogramer/index.html?mm=465611615&url=' + encodeURIComponent('https://tea.yufengtek.com/group1/M00/00/03/rBKAEVye5lmAIp5FABVGlZTkFe4092.jpg')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPanoData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /*
  全景
  */
  getPanoData: function () {
    const _this = this;
    handel.handelRequest(this, {
      url: "/em/getByPlot",
      data: {
        plot_id: my.getStorageSync({ 'key': 'plot_id' }).data || '',
      }
    }, function (res) {
      const imgUrl = 'https://tea.yufengtek.com/tea_Sprogramer/index.html?mm=465611615&url=' + encodeURIComponent(res.path);
      _this.setData({
        panoUrl: imgUrl
      })
    }, function (res) {
      if (res.code == 'w1010') {
        _this.setData({
          panoNum: 0,
        })
      }
    })
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