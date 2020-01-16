// pages/data_collection/data_collection.js
import Dialog from '../../vant_weapp/components/dist/dialog/dialog';
import Toast from '../../vant_weapp/components/dist/toast/toast';
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    scrollUnit: 33,
    timeChoose: [
      {
        time: '今天',
        day: 1 // 用于查询的参数
      },
      {
        time: '昨天',
        day: 2
      },
      {
        time: '近7天',
        day: 7
      }, 
      {
        time: '近30天',
        day: 30
      }
    ],
    poolId: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.isLoggedIn(); // 登录检测 
    this.setData({
      poolId: options.pool_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /* 方法区 */
  tabSelect(e) {
    // console.log(e)
    this.setData({
      scrollLeft: this.data.scrollUnit * (e.currentTarget.dataset.id),
      TabCur: e.currentTarget.dataset.id,
    })
    //根据ID获取组件对象
    var chart = this.selectComponent('#chart');
    //访问属性,使用data访问内部属性和组件属性
    //执行操作
    chart.updateData(e.currentTarget.dataset.day);
  },
  delfDefine() {
    Dialog.confirm({
      title: '自定义',
      message: '自定义时间设置暂未提供解决方案'
    }).then(() => {
      console.log('[INFO] 自定义数据时间段展示')
      
    }).catch(() => {
      console.log('[INFO] 已取消自定义数据时间设置')
    });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})