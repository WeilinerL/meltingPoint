//app.js
var util = require('./utils/json_to_urlencoded.js')

App({
  // 全局数据
  globalData: {
    /* topbar高度信息 */
    CustomBar: '',
    StatusBar: '',
    custom: '',
    /* 系统相关信息 */
    systemInfo: {
      windowHeight: 732,
      windowWidth: 412,
      system: "Android 5.0"
    },
    /* 分享相关信息 */
    shareObj: {
      title: "我的鱼塘 | 监测我的鱼塘数据"
    },
    /* 用户相关信息 */
    loggedIn: false,
    userInfo: {
      userId: ''
    },
    /* 网络相关信息 */
    networkInfo: {
      serverName: "49.234.81.43:3000"
    }
  },
  onLaunch: function () {
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        console.log("系统获取屏幕高度e", e)
        let custom = wx.getMenuButtonBoundingClientRect();
        console.log("系统获取屏幕高度", custom)
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        // 系统信息
        this.globalData.systemInfo.windowHeight = e.windowHeight;
        this.globalData.systemInfo.windowWidth = e.windowWidth;
        this.globalData.systemInfo.system = e.system;
      }
    });
  },
  onShow: function() {
    this.checkLocalUserInfo();
  },
  /* 是否登录 */
  isLoggedIn() {
    if(!this.globalData.loggedIn) {
      this.navigateToLogin();
      return false;
    }
    return true;
  },
  /* 未登录跳转到登录页面 */
  navigateToLogin() {
    wx.reLaunch({
      url: '../login/login'
    })
  },
  /* 判断是否有用户本地信息 */
  checkLocalUserInfo() {
    if (this.autoLogin()) {
      console.log("[INFO]用户已登录");
      this.globalData.loggedIn = true;
      let pages = getCurrentPages();
      if(pages.length == 0) {
        wx.reLaunch({
          url: 'pages/index/index',
        })
      } else {
        wx.navigateBack({

        })
      }
    } else {
      this.navigateToLogin();
    }
  },
  /* 获取用户登录信息 */
  autoLogin() {
    try {
      var userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.globalData.userInfo = userInfo;
        return true;
      } else {
        console.log("[INFO]本地无用户信息");
      }
    } catch (e) {
      console.log("[INFO]获取用户信息失败!");
    }
    return false;
  },
  /*
    全局函数：向服务器发请求
  */
  request: function (method, url, data, success, fail) {
    let that = this;
    // 转换一下数据格式否则后端 401 !important
    var stringifyData = util.JSON_to_URLEncoded(data);
    // console.log(stringifyData);
    wx.request({
      url: `http://${that.globalData.networkInfo.serverName}${url}`,
      data: stringifyData,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: method,
      dataType: 'json', // 返回数据格式
      success: function (res) {
        if (res.statusCode == 200) {
          if (success) {
            success(res.data)
          }
        } else {
          if (fail) {
            fail(res)
            console.log("app.request请求出错", res)
          }
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络请求出现问题，请检查您设备的网络状况',
          icon: 'none'
        })
        console.log("网络请求失败")
        if (fail) {
          fail(res)
        }
      }
    })
  },
  /* 数据加载 */
  showLoading(title = '加载中...', mask = true) {
    wx.showLoading({
      title: title,
      mask: mask
    })
  },
  /* 导航栏加载 */
  showNavigationBarLoading() {
    wx.showNavigationBarLoading()
  },
  /* 结束加载 */
  hideLoading() {
    wx.hideLoading();
  },
  hideNavigationBarLoading() {
    wx.hideNavigationBarLoading();
  }
})