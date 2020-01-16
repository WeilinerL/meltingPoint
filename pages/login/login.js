// pages/login/login.js
import Toast from '../../vant_weapp/components/dist/toast/toast';
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    passwordShow: 'true'
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
  
  forgetTap(e) {
    // console.log(e);
    
  },
  login_check() {
    if(this.data.username !== '' && this.data.password !== '') {
      var regex = /^[1][3,4,5,7,8][0-9]{9}$/;
      var result = this.data.username.match(regex);
      console.log(result);
      if (result) {
        return true;
      } else {
        Toast("请输入正确的手机号!");
      }
      return false;
    }else {
      Toast("用户名或密码不能为空!");
      console.log("[INFO]用户名或密码为空");
      return false;
    }
  },
  login() {
    if (!this.login_check()) {
      console.log("[INFO]登录信息有误");
    } else {
      app.request('POST', '/login_check', {
        'username': this.data.username,
        'password': this.data.password
      }, data => {
        console.log(data);
        if(data.status == "OK") {
          app.globalData.loggedIn = true;
          app.globalData.userInfo.userId = data.user_id;
          // 记录用户名密码方便下次登录
          try {
            wx.setStorageSync('userInfo', {
              username: this.data.username,
              password: this.data.password,
              userId: data.user_id
            })
          } catch (e) { 
            Toast("未知错误1"); // 存储错误
          }
          wx.switchTab({
            url: '../index/index'
          })
        }else {
          Toast("用户名或密码错误!")
        }
      })
    }
    
  },
  /* 监听用户输入用户名事件 */
  usernameInput(e) {
    var pattr = /[^0-9]*/g;
    this.data.username = e.detail.value;
    this.setData({
      username: this.data.username.replace(pattr,'') // 去除非数字
    })
    if (e.detail.value.length >= 11) {
      wx.hideKeyboard();
    }
  },
  useridInput: function (e) {
    // console.log(e);
    this.setData({
      username: e.detail.value
    });
    // if (e.detail.value.length >= 8) {
    //   wx.hideKeyboard();
    // }
  },
  passwdInput: function (e) {
    // console.log(e);
    this.setData({
      password: e.detail.value
    });
  },
  // 显示密码
  showPassword() {
    this.data.passwordShow == 'true' ? Toast("显示密码") : Toast("隐藏密码")
    this.setData({
      passwordShow: this.data.passwordShow == 'true' ? '' : 'true'
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
    var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: app.shareObj.title,
      path: '/pages/login/login',
      imageUrl: '',
    };
    return shareObj;
  }
})