// pages/calibration/calibration.js
//获取应用实例
import Dialog from '../../vant_weapp/components/dist/dialog/dialog';
import Toast from '../../vant_weapp/components/dist/toast/toast';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceName: '--',
    serialId: -1,
    timer: null,
    picker: ['4.00', '5.00', '6.00', '7.00', '8.00'],
    aimNumber: -1, // 目标示数
    value: '--', // 当前示数
    choosed1: "",
    choosed2: "",
    choosed3: "",
    statusCode: -1,
    standard: ["4.00", "6.86", "9.18"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.setData({
      deviceName: options.device_type == 'ph' ? 'pH探头' : options.device_type == 'dissolved_oxygen' ? '溶解氧探头' : '盐度探头',
      serialId: options.serial_id,
      statusCode: options.device_status_code
    })
    this.setData({
      standard: wx.getStorageSync(options.device_type + "_standard") == '' ? this.data.standard : wx.getStorageSync(options.device_type + "_standard")
    })
    // switch (this.data.deviceName) {
    //   case "pH探头":
    //     this.setData({
    //       aimNumber: 4.00,
    //       choosed1: "choosed",
    //       choosed2: "",
    //       choosed3: ""
    //     })
    //     break;
    //   case "溶解氧探头":
    //     this.setData({
    //       aimNumber: 6.86,
    //       choosed1: "",
    //       choosed2: "choosed",
    //       choosed3: ""
    //     })
    //     break;
    //   case "盐度探头":
    //     this.setData({
    //       aimNumber: 9.18,
    //       choosed1: "",
    //       choosed2: "",
    //       choosed3: "choosed"
    //     })
    //     break;
    //   default:
    //     Toast("非法进入校准页面!");
    //     console.log("[ERROR]非法进入校准页面!");
    // }
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
    if(this.data.timer != null) {
      clearInterval(this.data.timer);
      this.timer = null;
    }
    if(this.data.statusCode == 300) {
      let presentCalibration = wx.getStorageSync('present_calibration') == 'ph' ? 'pH' : wx.getStorageSync('present_calibration') == 'salinity' ? '盐度' : '溶解氧';
      let aimNumber = wx.getStorageSync("aimNumber");
      Toast("继续校准" + presentCalibration + "探头，目标示数: " + aimNumber);
      console.log("[INFO]继续校准" + presentCalibration +  "探头，目标示数: " + aimNumber);
      this.presentValue();
    }
  },

  /* 方法区 */
  startCalibration() {
    if(!this.data.timer) {
      if (this.data.aimNumber == -1) {
        Toast("请选择目标示数进行校准!");
      } else {
        app.request("POST", "/record_value", {
          user_id: app.globalData.userInfo.userId,
          serial_id: this.data.serialId,
          value: Number(this.data.aimNumber)
        }, successData => {
          Toast("开始校准...");
          console.log(successData);
          // 轮询记录当前示数
          this.presentValue();

          // wx.navigateTo({
          //   url: '../calibration_success/calibration_success',
          // })
        }, failData => {
          if (failData.statusCode == 404) {
            Toast("设备未连接!");
          } else {
            Toast("发生错误: " + failData.statusCode);
          }
        })

      }
    } else {
      Toast("校准中!请勿重复校准!");
    }
    
  },
  endCalibration() {
    let _that = this;
    app.request("POST", "/finish_calibration", {
      user_id: app.globalData.userInfo.userId,
      serial_id: _that.data.serialId,
    }, successData => {
      console.log(successData);
      clearInterval(_that.data.timer); // 记录清除timer 结束轮询
      wx.navgiateback({
        url: '../device_list/device_list',
      })
      
    }, failData => {
      if (failData.statusCode == 401) {
        // Toast("校准未结束!不能退出校准!");
        Dialog.confirm({
          title: '结束校准',
          message: '当前示数未稳定，正在校准中，您确定要退出校准吗？'
        }).then(() => {
          console.log('[INFO] 用户退出校准')
          this.stopViolent();
          clearInterval(_that.data.timer);
        }).catch(() => {
          console.log('[INFO] 用户取消退出校准')
        });
      } else {
        clearInterval(_that.data.timer);
        Toast("发生错误: " + failData.statusCode);
      }
    })
  },
  /* 强制退出校准 */
  stopViolent() {
    let _that = this;
    app.request("POST", "/exit_calibration", {
      user_id: app.globalData.userInfo.userId,
      serial_id: _that.data.serialId,
    }, successData => {
      console.log(successData);
      clearInterval(_that.data.timer); // 记录清除timer 结束轮询
      wx.navigateBack({
        url: '../device_list/device_list',
      })

    }, failData => {
        wx.navigateBack({
          url: '../device_list/device_list',
        })
        clearInterval(_that.data.timer);
        Toast("发生错误: " + failData.statusCode);
    })
  },
  /* 当前校准示数 */
  presentValue() {
    let _that = this;
    clearInterval(this.data.timer);
    this.data.timer = setInterval(() => {
      app.request("POST", "/calibration_value", {
        user_id: app.globalData.userInfo.userId,
        serial_id: this.data.serialId,
      }, successData => {
        // console.log(successData);
        _that.setData({
          value: successData.value.toFixed(2)
        })
      }, failData => {
        clearInterval(_that.data.timer);
        if (failData.statusCode == 404) {
          Toast("设备未连接!");
        } else {
          Toast("发生错误: " + failData.statusCode);
        }
      })
    }, 1000)
    
  },
  helpTap() {
    // console.log(e);
  },
  PickerChange(e) {
    // console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  chooseNumber(e) {
    // console.log(e);
    switch(e.currentTarget.dataset.id) {
      case "0":
        this.setData({
          choosed1: "choosed",
          choosed2: "",
          choosed3: "",
          aimNumber: this.data.standard[0]
        })
        wx.setStorageSync('aimNumber', this.data.standard[0]);
        break;
      case "1":
        this.setData({
          choosed1: "",
          choosed2: "choosed",
          choosed3: "",
          aimNumber: this.data.standard[1]
        })
        wx.setStorageSync('aimNumber', this.data.standard[1]);
        break;
      case "2":
        this.setData({
          choosed1: "",
          choosed2: "",
          choosed3: "choosed",
          aimNumber: this.data.standard[2]
        })
        wx.setStorageSync('aimNumber', this.data.standard[2]);
        break;
      default: 
        Toast("非法更改校准示数!");
        console.log("[ERROR]非法更改校准示数");
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
    if (this.data.timer != null) {
      clearInterval(this.data.timer);
    }
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