// components/mp-title/mp-title.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleFront: {
      type: String,
      value: "鱼塘"
    },
    titleLast: {
      type: String,
      value: "信息"
    },
    back: {
      type: String,
      value: null
    }
  },
  options: {
    addGlobalClass: true // ！important 不然父组件里面引用子组件，子组件样式失效
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateBack() {
      wx.navigateBack({
        
      })
    }
  }
})
