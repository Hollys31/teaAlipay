const app = getApp()
var QQMapWX = require('../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: '7Y5BZ-36FKQ-2GI5F-GHWJA-CJSKS-A5FJS'
});
var handle = {

  urlHeader: "https://tea.yufengtek.com/tea-IIS-Web/mini",
  tabBar: {
    "textColor": "#494949",
    "selectedColor": "#0aa666",
    "borderStyle": "white",
    "list": [{
      "selectedIconPath": "/resources/images/identify1.png",
      "iconPath": "/resources/images/identify.png",
      "pagePath": "/pages/index/index",
      "text": "认证"
    },
    {
      "selectedIconPath": "/resources/images/tea1.png",
      "iconPath": "/resources/images/tea.png",
      "pagePath": "/pages/teaPlantation/teaPlantation",
      "text": "茶园"
    },
    {
      "selectedIconPath": "/resources/images/camera1.png",
      "iconPath": "/resources/images/camera.png",
      "pagePath": "/pages/video/video",
      "text": "全景"
    },
    {
      "selectedIconPath": "/resources/images/weather1.png",
      "iconPath": "/resources/images/weather.png",
      "pagePath": "/pages/environmentChart/index",
      "text": "环境"
    }
    ]
  },
  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },
  reloadTrigger() { //重新加载
    let curpage = getCurrentPages()[0];
    my.reLaunch({
      url: "/" + curpage.route
    })
  },
  handelRequest(that, obj, callback, errcb) { //request请求
    const _this = this;
    const qrcodepri_num = my.getStorageSync({ key: 'qrcodepri_num' }).data || '';
    if (qrcodepri_num) {
      obj.data.qrcodepri_num = qrcodepri_num;
    }
    my.httpRequest({
      url: _this.urlHeader + "" + obj.url,
      data: obj.data,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        if (res.status == 200) {
          if (res.data.code == 200) {
            (callback && typeof (callback) === "function") && callback(res.data.repData);
          } else {
            if (errcb) {
              (errcb && typeof (errcb) === "function") && errcb(res.data);
            }
          }
        } else {
          my.showToast({
            content: '请求出错',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      },
      fail: function (err) {
        my.showToast({
          content: '请求出错',
          icon: 'none',
          duration: 2000
        })
        /*  my.navigateTo({
           url: '/pages/network/network',
         }) */
        return;
      },
      complete: function () {
        that.setData({
          loading: false
        })
      }
    })
  },
  getAddress(that, type, resCode) {
    const _this = this;
    my.getLocation({
      success(Local) {
        const latitude = Local.latitude
        const longitude = Local.longitude
        that.setData({
          loading: true
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (LocalRes) {
            const provice = LocalRes.result.ad_info.province;
            const city = LocalRes.result.ad_info.city;
            const district = LocalRes.result.ad_info.district;
            const address = provice + city + LocalRes.result.formatted_addresses.recommend;
            my.httpRequest({
              url: _this.urlHeader + "/orisech/check",
              data: {
                qrcodepri_num: resCode || '',
                orisech_gislong: latitude,
                orisech_gislate: longitude,
                orisech_prov: provice,
                orisech_city: city,
                orisech_town: district,
                orisech_addr: address
              },
              method: 'POST',
              dataType: 'json',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success: function (result) {
                if (result.status == 200 && result.data.code == 200) {
                  my.setStorageSync({
                    key: 'qrcodepri_num',
                    data: result.data.repData.qrcodepri_num
                  })
                  my.setStorageSync({
                    key: 'garden_id',
                    data: result.data.repData.garden_id,
                  })
                  my.setStorageSync({
                    key: 'plot_id',
                    data: result.data.repData.plot_id,
                  })
                  my.setStorageSync({
                    key: 'orisech_id',
                    data: result.data.repData.orisech_id,
                  })
                  if (type == 2) {
                    my.reLaunch({
                      url: '/pages/index/index',
                    })
                  } else {
                    that.onLoad()
                    my.reLaunch({
                      url: '/pages/index/index',
                    })
                  }
                } else {
                  that.setData({
                    loading: false
                  })
                  my.showToast({
                    icon: 'none',
                    content: '该二维码无效',
                  })
                }
              },
              fail() {
                my.showToast({
                  content: '请求出错',
                  icon: 'none',
                  duration: 2000
                })
              },
              complete: function () {
                that.setData({
                  loading: false
                })
              }
            })
          },
          fail: function (error) {
            my.showToast({
              content: '详细地址获取失败',
              icon: 'none'
            })
          },
          complete: function (res) {
            that.setData({
              loading: false
            })
          }
        })
      },
      fail() {
        that.setData({
          loading: false
        })
        my.showToast({
          type: 'none',
          content: '获取位置失败',
        })
      }
    })
  },
  getScanCode(that, type) {
    const _this = this;
    my.scan({
      type: 'qr',
      success: (resCode) => {
        var id = resCode.qrCode.split('=')[1]
        console.log(id);
        _this.getAddress(that, type, id);
      },
      fail: (res) => {
        my.showToast({
          title: "扫码失败",
          icon: 'none',
          duration: 2000
        })
        return
      }
    })

  },
  handelScanCode(that, type, code) { //获取用户当前位置后扫码
    var _this = this;
    my.getSetting({
      success(setRes) {
        console.log(setRes);
        if (setRes.authSetting['location'] !== undefined && setRes.authSetting['location'] != true) {
          consoel.log("未授权地理位置信息");
          my.confirm({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            confirmButtonText: '同意',
            cancelButtonText: '拒绝',
            success: result => {
              if (result.cancel) {
                my.showToast({
                  title: '拒绝授权',
                  icon: 'none'
                })
              } else if (result.confirm) {
                my.openSetting({
                  success: res => {
                    if (res.authSetting['scope.userLocation'] == true) {
                      my.showToast({
                        title: '授权成功',
                      })
                      if (type == 1) {//小程序扫码
                        _this.getScanCode(that, type);
                      } else {//二维码扫码
                        if (code) {
                          _this.getAddress(that, type, code);
                        }
                      }
                    }
                  }
                })
              }
            }
          })
        } else {//已进行地理位置授权
          if (type == 1) {//小程序扫码
            _this.getScanCode(that, type);
          } else {//二维码扫码
            if (code) {
              _this.getAddress(that, type, code);
            }

          }
        }
      }
    })

  },
  getOpenIdToFeedback: function (that) { //获取openId后跳转到反馈列表
    const _this = this;
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        _this.handelRequest(that, {
          url: "/getAliUser",
          data: {
            code: res.authCode
          }
        }, function (result) {
          my.setStorageSync({ key: 'openId', data: result.userId })
          my.navigateTo({
            url: '/pages/feedback/feedback',
          })
        })
      },
    });
  },
  editTabbar: function () { //tabbar
    my.hideTabBar();
    let tabbar = this.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
}
module.exports = handle;