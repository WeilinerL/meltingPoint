// components/empty-data.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '暂无数据'
    },
    description: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: 'info'
    },
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

  }
})
