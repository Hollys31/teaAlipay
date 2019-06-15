App({
  onLaunch(options) {
    console.log(options);
    const _this = this;
    my.getSystemInfo({
      success: function (res) {
        _this.globalData.systemInfo = res.model;
      }
    });
    my.setStorageSync({
      key: 'ewm',
      data: ''
    })
    if (options.query) {
      console.log(options.query.qrCode);
      my.setStorageSync({
        key: 'ewm',
        data: options.query.qrCode
      })
    } else if (options.scene != 1011 || options.scene != 1012) {
      my.reLaunch({
        url: '/pages/scanQRCode/scanQRCode',
      })
    } 
    /*   my.setStorageSync({
      key: 'qrcodepri_num',
      data: '20190307080000000061553931677800'
    })
    my.setStorageSync({
      key: 'garden_id',
      data: '55',
    })
    my.setStorageSync({
      key: 'plot_id',
      data: '114',
    })   */
  },
  globalData: {
    userInfo: null,
    qrcodepri_num: '',
    systemInfo: null,
  },

  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
