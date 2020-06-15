// miniprogram/pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 144
const MAX_IMAGE_NUM = 9
const db = wx.cloud.database()
let content = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true,
  },
  onInput(event) {
    let wordsNum = event.detail.value.length
    content = event.detail.value
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
  },
  onFocus(e) {
    this.setData({
      footerBottom: e.detail.height
    })
  },
  onBlur(e) {
    this.setData({
      footerBottom: 0
    })
  },
  onChooseImage() {
    wx.chooseImage({
      count: MAX_IMAGE_NUM - this.data.images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res)
        this.setData({
          images: [...this.data.images, ...res.tempFilePaths]
        })
        this.setData({
          selectPhoto: this.data.images.length < 9
        })
      }
    })
  },
  deleteImage(e) {

    let index = e.target.dataset.index
    this.setData({
      selectPhoto: true,
      images: [...this.data.images.slice(0, index), ...this.data.images.slice(index + 1)]
    })
    console.log(this.data.images)

  },
  onPreview(e) {
    wx.previewImage({
      urls: this.data.images,
      current: e.target.dataset.imagesrc
    })
  },
  send() {
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: ''
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask: true
    })
    let promiseArr = []
    let fileIds = []
    for (let i = 0; i < this.data.images.length; i++) {
      let p = new Promise((resolve, reject) => {
        const item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: (res) => {
            console.log(res)
            fileIds.push(res.fileID)
            resolve()
          },
          fail: (err) => {
            reject(err)
          }
        })
      })

      promiseArr.push(p)
    }
    Promise.all(promiseArr).then(res => {
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate()
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
          success: () => {
            wx.navigateBack()
            const pages = getCurrentPages()
            const prevPage = pages[pages.length - 2]
            prevPage.onPullDownRefresh()
          }
        })

      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
        icon: 'none'
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options

    console.log(options)
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
    // for (let index = 1000; index < 10000; index++) {
    //   let indexArr = index.toString().split('').map(item => parseInt(item))
    //   let [a, b, c, d] = indexArr
    //   let indexArr2 = indexArr.sort((a, b) => (b - a))
    //   if (Math.pow(indexArr2[0], 4) + (Math.pow(indexArr2[1], 4)) >= index) {
    //     continue
    //   }
    //   if ((a * 1000 + b * 100 + c * 10 + d )===( Math.pow(a, 4) + Math.pow(b, 4) + Math.pow(c, 4) + Math.pow(d, 4))) {
    //     console.log(index)
    //   }
    // }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})