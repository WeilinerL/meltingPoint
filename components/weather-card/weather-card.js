// components/weather-card/weathercard.js
import Toast from '../../vant_weapp/components/dist/toast/toast';
//获取应用实例
const app = getApp()

Component({
  lifetimes: {
    attached() {
      this.setSize(); // 初始化屏幕滑动单位
      this.initWeather(); // 初始化天气
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true // ！important 不然父组件里面引用子组件，子组件样式失效
  },
  /**
   * 组件的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    scrollUnit: 166,
    cardCur: 0,
    onload: true, // 正在加载 
    status: "天气数据加载中...", // 加载状态
    location: {
      city: "青岛市",
      area: "即墨区",
      weatherForecast: [
        {
          date: "12日星期天",
          high: "4",
          low: "-5",
          fengli: "3-4级",
          fengxiang: "北风",
          type: "晴"
        }
      ]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bannerTo(e) {
      // console.log(e);
      if (e.currentTarget.id) {
        wx.navigateTo({
          url: e.currentTarget.id
        })
      }
    },
    cardSwiper(e) { // 处理高光卡片滑动事件
      this.setData({
        cardCur: e.detail.current
      })
    },
    tabSelect(e) {
      this.setData({
        scrollLeft: this.data.scrollUnit * (e.currentTarget.dataset.id),
        TabCur: e.currentTarget.dataset.id,
      })
    },
    /* 初始化天气 */
    initWeather() {
      let _that = this;
      wx.request({
        url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + _that.data.location.area,
        data: null,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        dataType: 'json', // 返回数据格式
        success: function (res) {
          // 数据正常返回
          if (res.statusCode == 200) {
            console.log(res);
            let forecast = res.data.data.forecast;
            forecast = forecast.map(item => {
              item.high = item.high.split(" ")[1].split("℃")[0];
              item.low = item.low.split(" ")[1].split("℃")[0];
              item.fengli = item.fengli.match(/[0-9-]+.{1}/g)[0]
              return item;
            })
            // console.log(forecast);
            _that.setData({
              'location.weatherForecast': forecast,
              onload: false
            })
            
          } else {
            Toast("天气出了点小问题");
            console.log("[ERROR]初始化天气失败", res)
            _that.setData({
              onload: true,
              status: "天气数据加载失败!"
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '网络请求出现问题，请检查您设备的网络状况',
            icon: 'none'
          })
          console.log("[ERROR]网络请求失败")
          _that.setData({
            onload: true,
            status: "天气数据加载失败!"
          })
        }
      });
    },
    /* 动态设置屏幕参数 */
    setSize() {
      if(app.globalData.systemInfo.windowWidth >= 768) {
        this.setData({
          scrollUnit: 330
        })
      } else if (app.globalData.systemInfo.windowWidth > 320 && app.globalData.systemInfo.windowWidth < 375) {
        this.setData({
          scrollUnit: 150
        })
      } else if (app.globalData.systemInfo.windowWidth <= 320) {
        this.setData({
          scrollUnit: 130
        })
      }
    }
  }
})
