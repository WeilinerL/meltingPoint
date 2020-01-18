// pages/personal_center/personal_center.js
var timeUtil = require("../../utils/util.js");
import Dialog from '../../vant_weapp/components/dist/dialog/dialog';
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasNewMessages: false,
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

    this.getNewMessages().then((data) => {
      // console.log(data);
      let messageHandled = wx.getStorageSync('messageHandled') ? wx.getStorageSync('messageHandled') : [];
      // console.log(messageHandled);
      let messages = data.messages.map((message, index) => {
        message.time = timeUtil.formatTime(new Date(message.time * 1000)).split("-")[1] + '-' + timeUtil.formatTime(new Date(message.time * 1000)).split("-")[2];
        if (index + 1 > data.lastLen) {
          messageHandled.unshift(message);
        }
        return message
      });
      if (data.lastLen < messages.length) {
        this.setData({
          hasNewMessages: true
        })
      }
      wx.setStorageSync('messageHandled', messageHandled);
    }).catch((e) => {
      console.log("ERROR", e);
    });
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
    let messageHandled = wx.getStorageSync('messageHandled');
    let flag = false;
    let len = messageHandled.length;
    for(var i = 0; i < len; i ++) {
      if(!messageHandled[i].readStatus) {
        flag = true;
        break;
      }
    }
    this.setData({
      hasNewMessages: flag ? true : false
    })
    // console.log(messageHandled);
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
  getLocalMessages() {
    var messages = wx.getStorageSync('messages') ? wx.getStorageSync('messages') : {
      lastQueryTime: '',
      lastLen: 0,
      messages: []
    }
    return messages;
  },
  getNewMessages() {
    return new Promise((resolve, reject) => {
      let startTime = wx.getStorageSync('messages').lastQueryTime ? wx.getStorageSync('messages').lastQueryTime : '';
      let nowTime = parseInt(new Date().getTime() / 1000);
      if (!startTime) {
        app.request("POST", "/my_message", {
          user_id: app.globalData.userInfo.userId,
        }, successData => {
          console.log(successData);
          successData = successData.map((message) => {
            message.readStatus = false;
            return message;
          })
          var messages = {
            lastQueryTime: nowTime,
            lastLen: this.getLocalMessages().messages.length ? this.getLocalMessages().messages.length : 0,
            messages: successData
          }
          wx.setStorageSync('messages', messages);
          resolve(messages);
        }, failData => {
          Toast("发生错误!");
          reject("发生错误!");
        })
      } else {
        app.request("POST", "/my_message", {
          user_id: app.globalData.userInfo.userId,
          start_time: startTime
        }, successData => {
          console.log(successData);
          let messages1 = this.getLocalMessages().messages;
          successData.forEach(message => {
            messages1.push(message);
          })
          successData = successData.map((message) => {
            message.readStatus = false;
            return message;
          })
          var messages = {
            lastQueryTime: nowTime,
            lastLen: this.getLocalMessages().messages.length ? this.getLocalMessages().messages.length : 0,
            messages: messages1
          }
          wx.setStorageSync('messages', messages);
          resolve(messages);
        }, failData => {
          Toast("发生错误!");
          reject("发生错误!");
        })
      }
    })

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
  /* 导航到我的消息 */
  navigateToMessages() {
    wx.navigateTo({
      url: '../messages/messages',
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