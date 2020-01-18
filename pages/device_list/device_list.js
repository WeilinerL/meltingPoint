// pages/device_list/device_list.js
//获取应用实例
import Toast from '../../vant_weapp/components/dist/toast/toast';
const app = getApp();
var timeUtil = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poolId: -1,
    serialId: -1,
    status: "fail",
    deviceList: [],
    deviceListTemplate: [
      {
        imgSrc: "",
        code: "ph",
        deviceName: "pH探头",
        calibrationTime: "未校准"
      },
      {
        imgSrc: "",
        code: "dissolved_oxygen",
        deviceName: "溶解氧探头",
        calibrationTime: "未校准"
      },
      {
        imgSrc: "",
        code: "salinity",
        deviceName: "盐度探头",
        calibrationTime: "未校准"
      },
      {
        imgSrc: "",
        code: "temperature",
        deviceName: "温度探头",
        calibrationTime: "未校准"
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
    this.getDeviceList();
    // this.initDevice();
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
  getDeviceList() {
    app.request("POST", "/devices", {
      user_id: app.globalData.userInfo.userId
    }, successData => {
      console.log(successData);
      if(this.findDevice('ph', successData[0])) {
        this.data.deviceList.push(this.data.deviceListTemplate[0]);
      } 
      if (this.findDevice('dissolved_oxygen', successData[0])) {
        this.data.deviceList.push(this.data.deviceListTemplate[1]);
      } 
      if (this.findDevice('salinity', successData[0])) {
        this.data.deviceList.push(this.data.deviceListTemplate[2]);
      } 
      // 温度探头不需要校准
      // if (this.findDevice('temperature', successData[0])) {
      //   this.data.deviceList.push(this.data.deviceListTemplate[3]);
      // }
      this.setData({
        deviceList: this.data.deviceList
      })
      this.initDevice();
    }, failData => {
      Toast("初始化设备列表出错!");
      this.setData({
        status: "fail"
      })
    })

  },
  findDevice(deviceName, deviceObj) {
    if(deviceObj) {
      if (deviceObj[deviceName] != 0 && deviceObj[deviceName] != null) {
        return deviceObj[deviceName];
      }
    } 
    return false;
  },
  initDevice() {
    let _that = this;
    app.showLoading("设备数据加载中...");
    app.request("POST", "/device_info", {
      user_id: app.globalData.userInfo.userId,
      serial_id: this.data.serialId
    },
    successData => {
      console.log("[INFO]获取设备数据:", successData);
      if (this.findDevice('dissolved_time', successData)) {
        this.data.deviceList = this.data.deviceList.map(item => {
          if(item.deviceName == '溶解氧探头') {
            item.calibrationTime = timeUtil.formatTime(new Date(this.findDevice('dissolved_time', successData) * 1000))
          }
          return item;
        })
      } else {
        this.data.deviceList = this.data.deviceList.map(item => {
          if (item.deviceName == '溶解氧探头') {
            item.calibrationTime = '请购买设备'
          }
          return item;
        })
      }
      if (this.findDevice('ph_time', successData)) {
        this.data.deviceList = this.data.deviceList.map(item => {
          if (item.deviceName == 'pH探头') {
            item.calibrationTime = timeUtil.formatTime(new Date(this.findDevice('ph_time', successData) * 1000))
          }
          return item;
        })
      } else {
        this.data.deviceList = this.data.deviceList.map(item => {
          if (item.deviceName == 'pH探头') {
            item.calibrationTime = '请购买设备'
          }
          return item;
        })
      }
      if (this.findDevice('salinity_time', successData)) {
        this.data.deviceList = this.data.deviceList.map(item => {
          if (item.deviceName == '盐度探头') {
            item.calibrationTime = timeUtil.formatTime(new Date(this.findDevice('salinity_time', successData) * 1000))
          }
          return item;
        })
      } else {
        this.data.deviceList = this.data.deviceList.map(item => {
          if (item.deviceName == '盐度探头') {
            item.calibrationTime = '请购买设备'
          }
          return item;
        })
      }
      // console.log(this.data.deviceList);
      _that.setData({
        status: "success",
        deviceList: this.data.deviceList
      })
      app.hideLoading();
    },
    failData => {
      Toast("设备数据加载失败!请稍后重试");
      app.hideLoading();
      _that.setData({
        status: "fail"
      })
      console.log("[ERROR]设备数据加载失败!");
    })
  },
  /* 导航到校准页面 */
  navToCalibration(e) {
    // console.log(e);
    let flag = false;
    this.data.deviceList.forEach(device => {
      if (device.calibrationTime == "请购买设备" && device.code == e.currentTarget.dataset.deviceType) {
        flag = true;
      }
    })
    if (this.data.status == "success" && !flag) {
      app.request("POST", "/start_calibration", {
        user_id: app.globalData.userInfo.userId,
        serial_id: this.data.serialId,
        device_type: e.currentTarget.dataset.deviceType
      },
      successData => {
        console.log(successData);
        wx.navigateTo({
          url: '../calibration/calibration?device_type=' + e.currentTarget.dataset.deviceType + '&serial_id=' + this.data.serialId,
        })
        wx.setStorageSync(e.currentTarget.dataset.deviceType + "_standard", successData.standard);
        wx.setStorageSync('present_calibration', e.currentTarget.dataset.deviceType);

      }, failData => {
        wx.navigateTo({
          url: '../calibration/calibration?device_type=' + e.currentTarget.dataset.deviceType + '&serial_id=' + this.data.serialId + '&device_status_code=' + failData.statusCode,
        })
        
        // console.log(failData);
        // if(failData.statusCode == 404) {
        //   Toast("设备未连接!");
        // } else {
        //   Toast("发生错误: " + failData.statusCode);
        // }
      })

    } else {
      Toast("请先购买设备!");
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