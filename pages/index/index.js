//index.js
//获取应用实例
import Toast from '../../vant_weapp/components/dist/toast/toast';
const app = getApp()

Page({
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
  onLoad: function () {
    if (app.isLoggedIn()) { // 登录检测
      this.initPoolsData(); // 初始化鱼塘数据
      this.versionUpdate();
    } 
    
  },
  onShow: function() {

  },
  /* 方法区 */
  /* 版本更新 */
  versionUpdate() {
    // 检查用户版本更新
    if (wx.canIUse("getUpdateManager")) {
      let updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        console.log("[INFO]是否有新版本: " + res.hasUpdate);
      })
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '有新版本更新哦，点击确定完成更新',
          success: (res) => {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            } else if (res.cancel) {
              return false;
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        wx.hideLoading();
        wx.showModal({
          title: '升级失败',
          content: '新版本下载失败，请检查网络！',
          showCancel: false
        });
      });
    }
  },
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
