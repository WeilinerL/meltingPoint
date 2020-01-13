// pages/calibration/calibration.js
//获取应用实例
import Toast from '../../vant_weapp/components/dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker: ['4.00', '5.00', '6.00', '7.00', '8.00'],
    aimNumber: -1, // 目标示数
    choosed1: "",
    choosed2: "",
    choosed3: ""
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
  startCalibration() {
    if(this.data.aimNumber == -1) {
      Toast("请选择目标示数进行校准!");
    } else {
      wx.navigateTo({
        url: '../calibration_success/calibration_success',
      })
    }
  },
  endCalibration() {
    wx.navigateTo({
      url: '../device_list/device_list',  
    })
  },
  helpTap() {
    // console.log(e);
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  chooseNumber(e) {
    // console.log(e);
    this.setData({
      aimNumber: e.currentTarget.dataset.id
    })
    switch(e.currentTarget.dataset.id) {
      case "4.00":
        this.setData({
          choosed1: "choosed",
          choosed2: "",
          choosed3: ""
        })
        break;
      case "6.86":
        this.setData({
          choosed1: "",
          choosed2: "choosed",
          choosed3: ""
        })
        break;
      case "9.18":
        this.setData({
          choosed1: "",
          choosed2: "",
          choosed3: "choosed"
        })
        break;
      default: 
        console.log(e.currentTarget.dataset.id);
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