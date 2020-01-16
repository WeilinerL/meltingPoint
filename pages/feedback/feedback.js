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
    contact: '',
    pictures: [],
    inputLength: 0,
    submitted: false
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
  inputContact(e) {
    // console.log(e);
    this.setData({
      contact: e.detail.value
    })
  },
  getPictures(e) {
    // console.log(e);
    let pictures = e.detail.pictures;
    this.data.pictures = pictures;
    // pictures.map((picture, index) => {
    //   let obj = {};
    //   obj.url = picture;
    //   this.data.pictures.push(obj);
    // })
    // console.log(this.data.pictures);
  },
  /* 提交反馈 */
  submit() {
    if(this.submitCheck()) {
      if(!this.data.submitted) {
        app.request("POST", "/report", {
          user_id: app.globalData.userInfo.userId,
          content: this.data.feedbackInfo,
          contact: this.data.contact == '' ? '联系方式暂未提供' : this.data.contact,
          report_type: this.data.value,
          pictures: JSON.stringify(this.data.pictures)
        }, successData => {
          Toast("反馈成功!处理结果我们将在第一时间通知您!");
          console.log(successData);
          this.data.submitted = true;
        }, failData => {
          console.log(this.data);
          Toast("反馈失败!")
        })
      } else {
        Toast("您已提交反馈，请稍后再试!");
      }
    } 
  },
  submitCheck() {
    if(this.data.value == '' || this.data.feedbackInfo == '') {
      Toast("请填写反馈类型及反馈信息!");
      return false;
    } else {
      if(this.data.contact != '') {
        let telRex = /^[1][3,4,5,7,8][0-9]{9}$/;
        let emailRex = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/;
        let QQRex = /^[0-9]{5,10}$/;
        let contactCheck = String(this.data.contact).match(telRex) || String(this.data.contact).match(emailRex) || String(this.data.contact).match(QQRex);
        // console.log(contactCheck);
        if (!contactCheck) {
          Toast("请填写正确的联系方式!")
        } else {
          return true;
        }
      } else {
        return true;
      }
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