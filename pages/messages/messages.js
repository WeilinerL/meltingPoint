// pages/messages/messages.js
//获取应用实例
import Toast from '../../vant_weapp/components/dist/toast/toast';
const app = getApp();
var timeUtil = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [
      {
        title: "pH数据报警(测试用数据)",
        message: "鱼塘001pH示数为8.3，超过阀值8.0，持...",
        time: "12:00",
        readStatus: false
      }
    ]
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
    this.setData({
      messages: wx.getStorageSync('messageHandled')
    })
  },
  /* 方法区 */
  navigateToMessageDetail(e) {
    // console.log(e);
    wx.navigateTo({
      url: '../message_detail/message_detail?title=' + e.currentTarget.dataset.title + "&content=" + e.currentTarget.dataset.content + "&time_stamp=" + e.currentTarget.dataset.timeStamp,
    })
    this.data.messages[e.currentTarget.dataset.index].readStatus = true;
    wx.setStorageSync('messageHandled', this.data.messages);
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