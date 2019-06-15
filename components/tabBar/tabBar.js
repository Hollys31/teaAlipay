// components/tabBar/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo== "iPhone X" ? true : false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handelTopage(e){//跳转页面
      const url = e.currentTarget.dataset.url;
       my.navigateTo({
        url: url
      })
    }
  }
})
