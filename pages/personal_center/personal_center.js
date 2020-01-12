// pages/personal_center/personal_center.js
import Dialog from '../../vant_weapp/components/dist/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  logout() {
    Dialog.confirm({
      title: '退出登录',
      message: '您确定要退出登录吗？退出登录后当您需要再次使用本服务时需要重新登陆'
    }).then(() => {
      console.log('[INFO] 用户退出登录')
      // 清除缓存 退出登录
      wx.clearStorageSync();
      wx.reLaunch({
        url: '../login/login',
      })
    }).catch(() => {
      console.log('[INFO] 用户取消退出登录')
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