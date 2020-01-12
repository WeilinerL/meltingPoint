// components/chart/chart.js
import * as echarts from '../../ec-canvas/echarts';
var timeUtil = require("../../utils/util.js");
import Toast from '../../vant_weapp/components/dist/toast/toast';
//获取应用实例
const app = getApp()

function getOption(title, color) {
  var option = {
    title: {
      text: title,
      textStyle: {
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['7:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: title,
        type: 'line',
        stack: '总量',
        areaStyle: {
          color: color //改变区域颜色
        },
        itemStyle: {
          normal: {
            color: color, //改变折线点的颜色
            lineStyle: {
              color: color //改变折线颜色
            }
          }
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      }
    ]
  };
  return option;
}

var chartTemperature = null;
var chartPH = null;
var chartO2 = null;
var chartSalinity = null;

/* 温度折线图 */
function initChartTemperature(canvas, width, height) {
  chartTemperature = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chartTemperature);
  var option = getOption("温度", '#0081ff')
  chartTemperature.setOption(option);
  return chartTemperature;
}

/* pH折线图 */
function initChartPH(canvas, width, height) {
  chartPH = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chartPH);
  var option = getOption("pH", '#f37b1d')
  chartPH.setOption(option);
  return chartPH;
}

/* 溶解氧折线图 */
function initChartO2(canvas, width, height) {
  chartO2 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chartO2);
  var option = getOption("溶解氧", '#39b54a')
  chartO2.setOption(option);
  return chartO2;
}

/* 盐度折线图 */
function initChartSalinity(canvas, width, height) {
  chartSalinity = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chartSalinity);
  var option = getOption("盐度", '#8799a3')
  chartSalinity.setOption(option);
  return chartSalinity;
}

Component({
  lifetimes: {
    attached() {

    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.initPoolData(); // 初始化池塘数据
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    poolId: {
      type: Number,
      value: -1
    }
  },
  options: {
    addGlobalClass: true // ！important 不然父组件里面引用子组件，子组件样式失效
  },

  /**
   * 组件的初始数据
   */
  data: {
    dayTimeUnit: 86400, // 时间单位 天(秒)
    /* 温度 */
    ecTemperature: {
      onInit: initChartTemperature
    },
    /* pH */
    ecPH: {
      onInit: initChartPH
    },
    /* 溶解氧 */
    ecO2: {
      onInit: initChartO2
    },
    /* 盐度 */
    ecSalinity: {
      onInit: initChartSalinity
    },
    /* 数据 */
    poolDatas: [
      {
          pool_id: 1, 
          data_time: "2020-01-10 20:23:07", 
          ph: 2.28951,
          dissolved_oxygen: 0.975885, 
          temperature: 45.2466 ,
          salinity: 0.475576
      }
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navToDeviceList() {
      wx.navigateTo({
        url: '../device_list/device_list',
      })
    },
    /* 初始化鱼塘数据信息 */
    initPoolData() {
      console.log("[INFO]初始化池塘数据...");
      app.showLoading();
      app.request("POST", "/pool_data", {
        'user_id': app.globalData.userInfo.userId,
        'pool_id': this.properties.poolId,
        'start_time': parseInt(new Date().getTime()/1000) - this.data.dayTimeUnit*1
      },
      // 请求成功
      data => {
        let poolDatas = data.datas;
        poolDatas = poolDatas.map(item => {
          item.data_time = timeUtil.formatTime(new Date(item.data_time*1000));
          return item;
        })
        console.log(poolDatas);
        this.setData({
          poolDatas: poolDatas
        });
        app.hideLoading();
      },
      fail => {
        Toast("获取数据失败!");
        app.hideLoading();

      })
    },
    /* 更新数据信息 */
    updateData(startTime = 1, endTime = null) { // 默认查询前一天的
      console.log("[INFO]初始化池塘数据...");
      app.showLoading();
      let requestParam = null
      if(endTime) {
        requestParam = {
          'user_id': app.globalData.userInfo.userId,
          'pool_id': this.properties.poolId,
          'start_time': parseInt(new Date().getTime() / 1000) - this.data.dayTimeUnit * startTime,
          'end_time': parseInt(new Date().getTime() / 1000) - this.data.dayTimeUnit * endTime
        }
      } else {
        requestParam = {
          'user_id': app.globalData.userInfo.userId,
          'pool_id': this.properties.poolId,
          'start_time': parseInt(new Date().getTime() / 1000) - this.data.dayTimeUnit * startTime,
        }
      }
      app.request("POST", "/pool_data", requestParam,
        // 请求成功
        data => {
          let poolDatas = data.datas;
          poolDatas = poolDatas.map(item => {
            item.data_time = timeUtil.formatTime(new Date(item.data_time * 1000));
            return item;
          })
          console.log(poolDatas);
          this.setData({
            poolDatas: poolDatas
          });
          app.hideLoading();
        },
        fail => {
          Toast("获取数据失败!");
          app.hideLoading();

        })
    }
  }
})
