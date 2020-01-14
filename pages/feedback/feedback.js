// pages/feedback/feedback.js
//获取应用实例
import Toast from '../../vant_weapp/components/dist/toast/toast';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerStatus: '',
    picker: ['问题示例1', '问题示例2', '问题示例3', '问题示例4', '问题示例5', '问题示例6'],
    value: '', // 反馈类型
    feedbackInfo: '', // 反馈类型
    inputLength: 0
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
  openPicker() {
    this.setData({
      pickerStatus: this.data.pickerStatus == "" ? "animation-rotate" : this.data.pickerStatus == "animation-rotate" ? "animation-rotate-reverse" : "animation-rotate"
    })
  }, 
  closePicker() {
    this.openPicker();
  },
  PickerChange(e) {
    // console.log(e);
    this.openPicker();
    this.setData({
      index: e.detail.value,
      value: this.data.picker[e.detail.value],
    })
  },
  inputText(e) {
    // console.log(e);
    this.setData({
      feedbackInfo: e.detail.value,
      inputLength: e.detail.value.length
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