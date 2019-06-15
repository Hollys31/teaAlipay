// pages/index/index.js
var handel = require('../../utils/handel.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFocus: false,
    loading: true,
    tabbar: {},
    isLoading: true,
    infoTypeData: [{ 'type': 0, 'name': '溯源信息' }, { 'type': 1, 'name': '制茶工艺' }, { 'type': 2, 'name': '农事活动' }],
    traceabilityData: {},
    allTraceabilitys: [],
    weatherData: {},
    technologyData: {
      currStep: 1,
      craftVo: {},
    },
    husbandryData: { 'currentPage': 1, 'husbandry': [] },
    type: 0,
    name: '',
    phone: '',
    advice: '',
    nameEmpty: 1,
    phoneEmpty: 1,
    contextEmpty: 1,
    modalHidden: false,

    totalScanNum: 0,
    isReload: 0,
    traceCurr: 1,
    nomore: 'no'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    if (this.data.type == 0) {
      this.setData({
        allTraceabilitys: [],
        traceCurr: 1
      })
      this.getTraceabilityInfo()
    }
    if (this.data.type == 1) {
      this.getOriginsInfo()
    }
    if (this.data.type == 2) {
      this.setData({
        husbandryData: { 'currentPage': 1, 'husbandry': [] }
      })
      this.getHusbandryInfo()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getWeatherInfo() {//获取环境信息
    const _this = this;
    handel.handelRequest(_this, {
      url: "/orisech/weatherData",
      data: {}
    }, function (res) {
      _this.setData({
        weatherData: res
      })

    })
  },
  getTraceabilityInfo(currType) {//获取溯源信息数据
    const _this = this;
    this.setData({
      loading: true
    })

    handel.handelRequest(_this, {
      url: "/orisech/search",
      data: {}
    }, function (res) {
      _this.setData({
        traceabilityData: res,
        loading: false
      })
      if (currType) {
        _this.setData({
          type: currType,
        })
      }

      my.hideNavigationBarLoading()
      _this.getWeatherInfo()

    })
  },
  getmoreTraceability() {//查看更多溯源数据列表
    const _this = this;
    handel.handelRequest(_this, {
      url: "/orisech/listOrisechPage",
      data: {
        currentPage: _this.data.traceCurr,
        pageSize: 30
      }
    }, function (res) {
      let originSearchVos = _this.data.allTraceabilitys;
      if (res.originSearchVos) {
        originSearchVos = _this.data.allTraceabilitys.concat(res.originSearchVos)
      } else {
        originSearchVos = originSearchVos
      }
      _this.setData({
        allTraceabilitys: originSearchVos,
        loading: false
      })
      my.hideNavigationBarLoading()

      if (res.pageInfo.currentPage >= res.pageInfo.totalPages || _this.data.allTraceabilitys.length == 0) {
        _this.setData({
          nomore: 'yes'
        })
      }
    })
    _this.setData({
      traceCurr: _this.data.traceCurr + 1
    })
  },
  getOriginsInfo(currType) {//获取制茶工艺数据
    const _this = this;
    this.setData({
      loading: true
    })

    handel.handelRequest(_this, {
      url: "/orisech/craft",
      data: {}
    }, function (res) {
      if (currType) {
        _this.setData({
          type: currType,
        })
      }
      let technologyData = _this.data.technologyData;
      technologyData.craftVo = res.craftVo;
      _this.setData({
        technologyData: technologyData,
        loading: false
      })
      my.hideNavigationBarLoading()

    })
  },
  getHusbandryInfoRequest(currType) {//农事活动数据请求
    const _this = this;
    if (_this.data.husbandryData.currentPage == 1) {
      this.setData({
        loading: true
      })
    }
    handel.handelRequest(_this, {
      url: "/orisech/farm",
      data: {
        currentPage: _this.data.husbandryData.currentPage,
        pageSize: '5'
      }
    }, function (res) {
      if (currType) {
        _this.setData({
          type: currType,
        })
      }
      const husbandry = 'husbandryData.husbandry'
      let currentData = _this.data.husbandryData.husbandry
      currentData = currentData.concat(res.farmVos)
      _this.setData({
        [husbandry]: currentData,
        loading: false
      })
      my.hideNavigationBarLoading()
      if (res.farmVos.length == 0) {
        _this.setData({
          isLoading: false
        })
      }

    })
  },
  getHusbandryInfo(currType) {//获取农事活动数据
    const _this = this;
    if (this.data.husbandryData.husbandry.length == 0 || this.data.isReload == 1) {
      _this.getHusbandryInfoRequest(currType)
    }
  },
  changeStepImg(e) {//制茶工艺步骤图片轮播
    const currStep = e.detail.current + 1;
    const technologyData = 'technologyData.currStep'
    this.setData({
      [technologyData]: currStep
    })

  },
  changeStep(e) {//点击步骤显示对应图片
    const ind = e.currentTarget.dataset.index + 1;
    const technologyData = 'technologyData.currStep'
    this.setData({
      [technologyData]: ind
    })
  },
  changeTabEvent(currType) {
    if (currType == 0 && Object.keys(this.data.traceabilityData).length == 0) {
      this.getTraceabilityInfo(currType);
    } else if (currType == 1 && Object.keys(this.data.technologyData.craftVo).length == 0) {
      this.getOriginsInfo(currType)
    } else if (currType == 2 && this.data.husbandryData.husbandry.length == 0) {
      this.getHusbandryInfo(currType)
    } else {
      this.setData({
        type: currType
      })
    }
  },
  handelInfoType(e) {//点击切换页面 切换类型
    const currType = e.currentTarget.dataset.type;
    this.changeTabEvent(currType);
  },
  switchTabPage(e) {//左右滑动切换页面
    const currType = e.detail.current;
    this.changeTabEvent(currType);
  },
  openModal() {//显示模态框
    this.setData({
      modalHidden: true,
      nameEmpty: 1,
      phoneEmpty: 1,
      contextEmpty: 1,
    })
  },
  closeModal() {//关闭模态框
    this.setData({
      modalHidden: false,
      nameEmpty: 1,
      phoneEmpty: 1,
      contextEmpty: 1,
      advice: ''
    })
  },
  handelInputFocus(e) {//输入框focus
    const name = e.target.dataset.name;
    this.setData({
      [name]: 1
    })
  },
  handelInputBlur(e) {//输入框blur
    const name = e.target.dataset.name;
    if (name == "nameEmpty") {
      if (e.detail.value.length == 0) {
        this.setData({
          [name]: 0
        })
      }
    }
    if (name == 'phoneEmpty') {
      if (e.detail.value.length == 0 || !(/^1[34578]\d{9}$/.test(e.detail.value))) {
        this.setData({
          [name]: 0
        })
      }
    }
    if (name == "contextEmpty") {
      this.setData({
        isFocus: false,
        advice: e.detail.value
      })
      if (e.detail.value.length == 0) {
        this.setData({
          [name]: 0
        })
      }
    }
  },
  handelviewFocus() {
    this.setData({
      isFocus: true
    })
  },
  saveFeedback(e) {//保存异常反馈
    const _this = this;
    let num = 0;
    if (e.detail.value.name.length == 0) {
      this.setData({
        nameEmpty: 0
      })
      num = 1;
    }
    if (e.detail.value.phone.length == 0 || !(/^1[34578]\d{9}$/.test(e.detail.value.phone))) {
      this.setData({
        phoneEmpty: 0
      })
      num = 1;
    }
    if (e.detail.value.advice.length == 0) {
      this.setData({
        contextEmpty: 0
      })
      num = 1;
    }
    if (num < 1) {
      handel.handelRequest(_this, {
        url: "/originfedback/save",
        data: {
          odbk_content: e.detail.value.advice,//反馈内容
          odbk_title: _this.data.traceabilityData.vo.garden_name,//标题
          qrcodepri_id: my.getStorageSync({ key: 'qrcodepri_num' }).data || '',
          wxopen_id: my.getStorageSync({ key: 'openId' }).data || '',
          wx_phone: e.detail.value.phone
        }
      }, function (res) {
        _this.setData({
          modalHidden: false,
          advice: ''
        })
        my.navigateTo({
          url: '/pages/feedback/feedback',
        })
      })
    }
  },
  handelScanCode: function () {//再次扫码
    handel.handelScanCode(this, 1)
  },
  toFeedback() {//异常反馈页跳转
    this.setData({
      modalHidden: false,
    });
    handel.getOpenIdToFeedback(this);
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {

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
    my.showNavigationBarLoading()
    my.stopPullDownRefresh()
    this.setData({
      isReload: 1
    })
    this.onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    if (_this.data.type == 2) {
      let currentPage = 'husbandryData.currentPage'
      this.setData({
        [currentPage]: _this.data.husbandryData.currentPage + 1
      })
      _this.getHusbandryInfoRequest()

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})