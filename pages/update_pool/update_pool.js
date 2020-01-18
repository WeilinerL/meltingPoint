// pages/update_pool/update_pool.js
//获取应用实例
import Toast from '../../vant_weapp/components/dist/toast/toast';
import Dialog from '../../vant_weapp/components/dist/dialog/dialog';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: [],
    poolName: '',
    telNumber: '',
    poolArea: '',
    poolAddressDetail: '',
    picture: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
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
  /* 输入鱼塘名称 */
  inputPoolName(e) {
    // console.log(e);
    this.setData({
      poolName: e.detail.value
    })
  },
  /* 输入手机号码 */
  inputTelNumber(e) {
    // console.log(e);
    var pattr = /[^0-9]+/g;
    this.data.telNumber = e.detail.value
    this.setData({
      telNumber: this.data.telNumber.replace(pattr, '')
    })
    if (e.detail.value.length >= 11) {
      wx.hideKeyboard();
    }
  },
  /* 输入所在区域 */
  inputPoolArea(e) {
    // console.log(e);
    this.setData({
      poolArea: e.detail.value
    })
  },
  /* 输入详细地址 */
  inputAddressDetail(e) {
    // console.log(e);
    this.setData({
      poolAddressDetail: e.detail.value
    })
  },
  /* 输入鱼塘名称检测 */
  inputPoolNameCheck() {
    if (this.data.poolName == '') {
      Toast("请输入鱼塘名称!");
      return false
    } else {
      // 过滤特殊字符
      // var pattr = /[^\!@#\$%^&\*\(\)-\+/;:"',<>\.\?|\{\}\[\]！@#¥%……&*（）《》？：；“‘「」【】、|·～`~\s+]+/g;
      var pattr = /[0-9a-z\u4e00-\u9fa5_]+/gi;
      var result = this.data.poolName.match(pattr);
      if (result == null || result[0] != this.data.poolName) {
        Toast("请输入正确的鱼塘名称!不能带有特殊字符!");
        return false;
      }
      return true;
    }
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
  /* 输入所在区域检测 */
  inputPoolAreaCheck() {
    if (this.data.poolArea == '') {
      Toast("请输入鱼塘所在区域!");
      return false;
    }
    return true;
  },
  /* 输入详细地址检测 */
  inputPoolAddressDetailCheck() {
    if (this.data.poolAddressDetail == '') {
      Toast("请输入鱼塘详细地址!");
      return false;
    }
    return true;
  },
  inputPictureCheck() {
    if (!this.data.picture) {
      Toast("请上传一张鱼塘图片!");
      return false;
    }
    return true;
  },
  /* 提交信息 */
  submit() {
    if (this.inputPoolNameCheck()
      && this.inputTelNumberCheck()
      && this.inputPoolAreaCheck()
      && this.inputPoolAddressDetailCheck()
      && this.inputPictureCheck()) {
      Dialog.confirm({
        title: '确认修改',
        message: '您确定要修改此鱼塘信息吗?'
      }).then(() => {
        console.log('[INFO] 用户修改鱼塘信息')
        // this.picUpload(this.data.picture).then((data) => {
        //   app.request("POST", "/add_pool", {
        //     user_id: app.globalData.userInfo.userId,
        //     phone: this.data.telNumber,
        //     pool_name: this.data.poolName,
        //     pool_addr: this.data.poolAddressDetail,
        //     pool_locale: this.data.poolArea,
        //     pic_url: 'http://' + app.globalData.networkInfo.serverName + "/pic/" + data
        //   }, successData => {
        //     console.log(successData);
        //     if (successData.status == 'OK') {
        //       Toast("添加成功!");
        //       // 一秒后返回
        //       setTimeout(() => {
        //         wx.navigateBack({

        //         })
        //       }, '1000')
        //     } else {
        //       Toast("修改失败!");
        //     }
        //   }, failData => {
        //     Toast("修改失败!");
        //     console.log(failData);
        //   })
        // }).catch((e) => {
        //   Toast("修改失败");
        //   console.log(e);
        // })
      }).catch(() => {
        console.log('[INFO] 用户取消修改鱼塘信息')
      });
      

    }
  },
  /* 删除确认 */
  deleteConfirm() {
    Dialog.confirm({
      title: '确认修改',
      message: '您确定要删除此鱼塘吗?'
    }).then(() => {
      console.log('[INFO] 用户删除鱼塘')
      
    }).catch(() => {
      console.log('[INFO] 用户取消删除鱼塘')
    });
  },
  /* 获取图片列表 */
  getPictures(e) {
    // console.log(e);
    let picture = e.detail.pictures[0];
    this.data.picture = picture;
  },
  picUpload(picture) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'http://' + app.globalData.networkInfo.serverName + '/post_picture',
        filePath: picture,
        name: 'file',
        formData: {
          user_id: app.globalData.userInfo.userId,
          file: picture,
          path_to_local: ''
        },
        success(res) {
          let data = JSON.parse(res.data)
          console.log(data);
          resolve(data.url);
          //do something
        },
        fail: e => {
          console.log("图片上传失败");
          reject(e);
        }
      })
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