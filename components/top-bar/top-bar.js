// components/top-bar/top-bar.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hasBack: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    navigationBarTitleText: {
      type: String,
      value: ''
    }
  },
  options: {
    addGlobalClass: true // ！important 不然父组件里面引用子组件，子组件样式失效
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
