// components/chart/chart.js
import * as echarts from '../../ec-canvas/echarts';
var timeUtil = require("../../utils/util.js");
import Toast from '../../vant_weapp/components/dist/toast/toast';
//获取应用实例
const app = getApp()

function getOption(title, color, xData = [], yData = [], interval = 0) {
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
        data: xData,
        axisLabel: {
          interval: interval,//0代表显示所有x轴标签
          rotate: 45, //代表逆时针旋转45度,
          formatter: function (value, index) {//自定义X轴的显示
            var text1 = value.split(" ")[0];
            var text2 = value.split(" ")[1];
            var year = text1.split("-")[0];
            var month = text1.split("-")[1];
            var day = text1.split("-")[2];
            var hour = text2.split(":")[0];
            var min = text2.split(":")[1];
            var time = month + "/" + day + " " + hour + ":" + min
            if (index === 0) {
              time = null;
            }
            return time;
          }
        }
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
        data: yData
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

    },
    ready() {
      this.initPoolData(); // 初始化池塘数据      
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      this.updateEcharts(this.data.poolDatas); // 初始化池塘数据      
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
    showDatas: [
      {
        pool_id: 1,
        data_time: "2020-01-10 20:23:07",
        ph: 2.28951,
        dissolved_oxygen: 0.975885,
        temperature: 45.2466,
        salinity: 0.475576
      }
    ],
    moreDataStatus: '没有更多了'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // navToDeviceList() {
    //   wx.navigateTo({
    //     url: '../device_list/device_list',
    //   })
    // },
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
        // 更新echarts
        // this.updateEcharts(poolDatas);
        app.hideLoading();
      },
      fail => {
        Toast("获取数据失败!");
        app.hideLoading();
      })
    },
    /* 更新数据信息 */
    updateData(startTime = 1, endTime = null) { // 默认查询前一天的
      console.log("[INFO]更新池塘数据...");
      app.showLoading();
      let requestParam = null
      if(endTime) {
        requestParam = {
          'user_id': app.globalData.userInfo.userId,
          'pool_id': this.properties.poolId,
          'start_time': parseInt(new Date().getTime() / 1000) - timeUtil.transformTime(this.data.dayTimeUnit, startTime),
          'end_time': parseInt(new Date().getTime() / 1000) - timeUtil.transformTime(this.data.dayTimeUnit, endTime)
        }
      } else {
        requestParam = {
          'user_id': app.globalData.userInfo.userId,
          'pool_id': this.properties.poolId,
          'start_time': parseInt(new Date().getTime() / 1000) - timeUtil.transformTime(this.data.dayTimeUnit, startTime),
        }
      }
      // console.log(requestParam);
      app.request("POST", "/pool_data", requestParam,
        // 请求成功
        data => {
          let poolDatas = data.datas;
          poolDatas = poolDatas.map(item => {
            item.data_time = timeUtil.formatTime(new Date(item.data_time * 1000));
            item.temperature = item.temperature.toFixed(1);
            item.ph = item.ph.toFixed(1);
            item.dissolved_oxygen = item.dissolved_oxygen.toFixed(1);
            item.salinity = item.salinity.toFixed(1);
            return item;
          })
          console.log(poolDatas);
          this.setData({
            poolDatas: poolDatas,
            showDatas: poolDatas.slice(0,50)
          });
          // 更新echarts
          this.updateEcharts(poolDatas);
          app.hideLoading();
        },
        fail => {
          Toast("获取数据失败!");
          app.hideLoading();

        })
    },
    /* 查看更多数据 */
    showMore() {
      console.log(this.data.showDatas);
      if (this.data.showDatas.length >= this.data.poolDatas.length) {
        this.setData({
          moreDataStatus: "没有更多了"
        })
      } else {
        this.setData({
          showDatas: this.data.poolDatas.slice(0, this.data.showDatas.length + 50)
        });
      }
      
    },
    /* 更新echarts */
    updateEcharts(poolDatas) {
      // 提取时间
      var times = poolDatas.map(item => {
        return item.data_time;
      })
      // 提取温度
      var temperatures = poolDatas.map(item => {
        return item.temperature;
      })
      // 提取ph
      var phs = poolDatas.map(item => {
        return item.ph;
      })
      // 提取溶解氧
      var dissolvedOxygens = poolDatas.map(item => {
        return item.dissolved_oxygen;
      })
      // 提取盐度
      var salinitys = poolDatas.map(item => {
        return item.salinity;
      })
      // 更新 
      chartTemperature.setOption(getOption("温度", '#0081ff', times, temperatures, 5));
      chartPH.setOption(getOption("pH", '#f37b1d', times, phs, 5));
      chartO2.setOption(getOption("溶解氧", '#39b54a', times, dissolvedOxygens, 5));
      chartSalinity.setOption(getOption("盐度", '#8799a3', times, salinitys, 5));
    }
  }
})
