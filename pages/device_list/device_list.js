// pages/device_list/device_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poolId: -1,
    deviceList: [
      {
        imgSrc: "",
        deviceName: "温度探头",
        calibrationTime: "2019.8.6"
      },
      {
        imgSrc: "",
        deviceName: "温度探头",
        calibrationTime: "2019.8.6"
      },
      {
        imgSrc: "",
        deviceName: "温度探头",
        calibrationTime: "2019.8.6"
      },
      {
        imgSrc: "",
        deviceName: "温度探头",
        calibrationTime: "2019.8.6"
      },
      {
        imgSrc: "",
        deviceName: "温度探头",
        calibrationTime: "2019.8.6"
      },
      {
        imgSrc: "",
        deviceName: "温度探头",
        calibrationTime: "2019.8.6"
      },
      {
        imgSrc: "",
        deviceName: "温度探头",
        calibrationTime: "2019.8.6"
      },
      {
        imgSrc: "",
        deviceName: "温度探头",
        calibrationTime: "2019.8.6"
      },
      {
        imgSrc: "",
        deviceName: "温度探头",
        calibrationTime: "2019.8.6"
      },
      {
        imgSrc: "",
        deviceName: "温度探头",
        calibrationTime: "2019.8.6"
      },
      {
        imgSrc: "",
        deviceName: "温度探头",
        calibrationTime: "2019.8.6"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
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
  navToCalibration(e) {
    wx.navigateTo({
      url: '../calibration/calibration',
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