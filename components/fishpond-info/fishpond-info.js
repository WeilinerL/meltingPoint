// components/fishpond-info/fishpond-info.js
//获取应用实例
const app = getApp()

Component({

  lifetimes: {
    attached() {

    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.initPoolsData(); // 初始化鱼塘数据          
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    routeType: {
      type: String,
      value: "pool_data" // 暂分为两类 一类是pool_data 另一类是pool_device 默认是pool_data (决定路游跳转页面规则)
    }
  },
  options: {
    addGlobalClass: true // ！important 不然父组件里面引用子组件，子组件样式失效
  },

  /**
   * 组件的初始数据
   */
  data: {
    pools: [
      // {
      //   pool_id: '001',
      //   pool_name: '青岛市即墨区',
      //   serial_id: '默认',
      //   fishpondPic: ''
      // }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    seeFishpondDetail(e) {
      // console.log(e);
      var poolId = e.currentTarget.dataset.poolId;
      if(this.properties.routeType == "pool_data") {
        // 导航到数据统计
        wx.navigateTo({
          url: '../data_collection/data_collection?pool_id=' + poolId,
        })
      } else if (this.properties.routeType == "pool_device") {
        // 导航到设备列表
        wx.navigateTo({
          url: '../device_list/device_list?pool_id=' + poolId,
        })
      }
      
    },
    /* 初始化鱼塘数据 */
    initPoolsData() {
      app.showLoading("鱼塘数据加载中...");
      app.request('POST', '/pools', { 'user_id': app.globalData.userInfo.userId }, data => {

        console.log(data);
        this.setData({
          pools: data.pools
        })
        app.hideLoading();
      },
        fail => {
          Toast("获取鱼塘信息失败!");
        })
    }
  }
})
