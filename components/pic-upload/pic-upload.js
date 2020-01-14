// components/pic-upload/pic-upload.js
//获取应用实例
import Toast from '../../vant_weapp/components/dist/toast/toast';
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "添加照片"
    },
    number: {
      type: Number,
      value: 3 // 默认只能上传3张图片
    },
    hostUrl: {
      type: String,
      value: "" // 图片上传服务器地址
    }
  },
  options: {
    addGlobalClass: true // ！important 不然父组件里面引用子组件，子组件样式失效
  },
  /**
   * 组件的初始数据
   */
  data: {
    pictureData: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* 上传图片 */
    addPicture() {
      let _that = this;
      if (this.data.pictureData.length >= this.properties.number) {
        Toast("最多上传" + this.properties.number + "张图片!");
      } else {
        wx.chooseImage({
          count: this.properties.number - _that.data.pictureData.length,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths
            // console.log(tempFilePaths);
            tempFilePaths.forEach(picture => {
              _that.data.pictureData.push(picture);
            })
            _that.setData({
              pictureData: _that.data.pictureData
            })
          }
        })
      }

    },
    /* 删除图片 */
    deletePic(e) {
      // console.log(e);
      this.data.pictureData.splice(e.currentTarget.dataset.index, 1);
      this.setData({
        pictureData: this.data.pictureData
      })

    },
    /* 查看图片 */
    previewImage(e) {
      console.log(e);
      wx.previewImage({
        current: e.currentTarget.dataset.url, // 当前显示图片的http链接
        urls: this.data.pictureData // 需要预览的图片http链接列表
      })
    }
  }
})
