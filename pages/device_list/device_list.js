// pages/device_list/device_list.js
//获取应用实例
import Toast from '../../vant_weapp/components/dist/toast/toast';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poolId: -1,
    serialId: -1,
    status: "fail",
    deviceList: [
      {
        imgSrc: "",
        deviceName: "pH探头",
        calibrationTime: "--"
      },
      {
        imgSrc: "",
        deviceName: "溶解氧探头",
        calibrationTime: "--"
      },
      {
        imgSrc: "",
        deviceName: "盐度探头",
        calibrationTime: "--"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.setData({
      poolId: options.pool_id,
      serialId: options.serial_id
    })
    this.initDevice();
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
  initDevice() {
    let _that = this;
    app.showLoading("设备数据加载中...");
    app.request("POST", "/device_info", {
      user_id: app.globalData.userInfo.userId,
      serial_id: this.data.serialId
    },
    successData => {
      console.log("[INFO]获取设备数据:", successData);
      _that.setData({
        status: "success",
        deviceList: [
          {
            imgSrc: "",
            deviceName: "pH探头",
            calibrationTime: successData.ph_time == null ? '未校准' : successData.ph_time
          },
          {
            imgSrc: "",
            deviceName: "溶解氧探头",
            calibrationTime: successData.dissolved_time == null ? '未校准' : successData.dissolved_time
          },
          {
            imgSrc: "",
            deviceName: "盐度探头",
            calibrationTime: successData.temperature_time == null ? '未校准' : successData.temperature_time
          }
        ]
      })
      app.hideLoading();
    },
    failData => {
      Toast("设备数据加载失败!请稍后重试");
      _that.setData({
        status: "fail"
      })
      console.log("[ERROR]设备数据加载失败!");
    })
  },
  /* 导航到校准页面 */
  navToCalibration(e) {
    // console.log(e);
    if (this.data.status == "success") {
      wx.navigateTo({
        url: '../calibration/calibration?device_type=' + e.currentTarget.dataset.deviceType,
      })
    } else {
      Toast("设备未连接!");
    }
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