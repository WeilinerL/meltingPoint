//index.js
//获取应用实例
import Toast from '../../vant_weapp/components/dist/toast/toast';
const app = getApp()

Page({
  data: {
    pools: [
      {
        pool_id: '001',
        pool_name: '青岛市即墨区',
        serial_id: '默认',
        fishpondPic: ''
      }
    ]
  },
  onLoad: function () {
    if (app.isLoggedIn()) { // 登录检测
      this.initPoolsData(); // 初始化鱼塘数据
    } 
    
  },
  onShow: function() {

  },
  /* 方法区 */
  seeFishpondDetail(e) {
    // console.log(e);
    var poolId = e.currentTarget.dataset.poolId;
    // 导航到数据统计
    wx.navigateTo({
      url: '../data_collection/data_collection?pool_id=' + poolId,
    })
  },
  /* 初始化鱼塘数据 */
  initPoolsData() {
    app.showLoading("鱼塘数据加载中...");
    app.request('POST', '/pools', {'user_id': app.globalData.userInfo.userId}, data => {

      console.log(data);
      this.setData({
        pools: data.pools
      })
      app.hideLoading();
    },
    fail => {
      Toast("获取鱼塘信息失败!");
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: app.globalData.shareObj.title,
      path: '/pages/index/index',
      imageUrl: '',
    };
    return shareObj;
  }
})
