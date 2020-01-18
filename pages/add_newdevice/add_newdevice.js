// pages/add_newdevice/add_newdevice.js
//获取应用实例
import Toast from '../../vant_weapp/components/dist/toast/toast';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: ''
    },
    fishpoolId: "001",
    telNumber: '',
    serialNumber: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    let _that = this;
    _that.setData({
      fishpoolId: options.pool_id
    })
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
                'userInfo.avatarUrl': res.userInfo.avatarUrl
              })
            }
          })
        }
      }
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
  /* 输入电话号码 */
  inputTelNumber(e) {
    // console.log(e);
    let pattr = /[^0-9]*/g;
    this.data.telNumber = e.detail.value;
    this.setData({
      telNumber: this.data.telNumber.replace(pattr, '')
    })
    if (e.detail.value.length >= 11) {
      wx.hideKeyboard();
    }    
  },
  /* 输入设备序列号 */
  inputSerialNumber(e) {
    // console.log(e);
    this.setData({
      serialNumber: e.detail.value
    })
  },
  /* 输入检查 */
  inputCheck(parm, errMsg) {
    if(this.data[parm] == '') {
      Toast(msg);
      return false;
    }
    return true;
  },
  /* 输入电话号码检测 */
  inputTelNumberCheck() {
    if (this.data.telNumber == '') {
      Toast("请输入电话号码!");
      return false;
    } else {
      var pattr = /^[1][3,4,5,7,8][0-9]{9}$/;
      var result = this.data.telNumber.match(pattr);
      if (result == null || result != this.data.telNumber) {
        Toast("请输入正确的电话号码");
        return false;
      }
      return true;
    }

  },
  /* 提交 */
  submit() {
    if (this.inputTelNumberCheck() && this.inputCheck('serialNumber', '请输入正确的序列号')) {
      app.request("POST", "/register_device", {
        user_id: app.globalData.userInfo.userId,
        pool_id: this.data.fishpoolId,
        serial_id: this.data.serialNumber,
        phone: this.data.telNumber
      }, successData => {
        if(successData == 'OK') {
          Toast("添加设备成功!");
          setTimeout(() => {
            wx.navigateBack({
              
            })
          }, 1000)
          // console.log(successData);
        } else {
          Toast("添加设备失败! " + successData.toString());
        }
        
      }, failData => {
        Toast("添加设备失败!");
        console.log('[INFO]添加设备失败', failData);
      })
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