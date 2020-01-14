// pages/personal_center/personal_center.js
import Dialog from '../../vant_weapp/components/dist/dialog/dialog';
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {
      nickName: '海风千里岛',
      avatarUrl: '',
      telNumber: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              // console.log(res.userInfo)
              console.log("[INFO]微信用户已授权获取用户信息");
              _that.setData({
                'userInfo.nickName': res.userInfo.nickName,
                'userInfo.avatarUrl': res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
    this.setData({
      'userInfo.telNumber': app.globalData.userInfo.username
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
  bindGetUserInfo(e) {
    // console.log(e.detail.userInfo)
    if(e.detail.userInfo) {
      this.setData({
        'userInfo.nickName': e.detail.userInfo.nickName,
        'userInfo.avatarUrl': e.detail.userInfo.avatarUrl
      })
      console.log("[INFO]微信用户已授权获取用户信息");
    } else {
      console.log("[INFO]微信用户拒绝授权获取用户信息");
    }
  },
  /* 导航到意见反馈页面 */
  navigateToFeedback() {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  /* 导航到鱼塘列表页面 */
  calibrationMyDevice() {
    wx.navigateTo({
      url: '../choose_fishpool/choose_fishpool',
    })
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