// pages/blog/blog.js
let keyword=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
    blogList: []
  },

  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: ({ authSetting }) => {

        if (authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              console.log(res)
              this.loginsuccess({ detail: res.userInfo })
            }
          })

        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })

  },
  loginsuccess(userInfo) {

    let { detail: { nickName, avatarUrl } } = userInfo
    console.log(nickName)
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${nickName}&avatarUrl=${avatarUrl}`
    })
  },
  loginfail() {
    console.log('fail')
    wx.showModal({
      title: '授权后才能发布',
      content: ''
    })
  },
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: '加载中...'
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        start,
        keyword,
        count: 10,
        $url: 'list',
      }
    }).then(res => {
      wx.hideLoading()
      wx.stopPullDownRefresh()//更新完成后立马取消下拉的状态
      if (res.result.length===0) {
        wx.showToast({
          title:'暂无数据',
          icon:'none'
        })
        return
      }
      
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
    })
  },
  goComment(e){
    let blogId = e.target.dataset.blogid
    wx.navigateTo({
      url:`../../pages/blog-comment/blog-comment?blogId=${blogId}`
    })
  },
  onSearch(e){
    console.log(e)
    keyword = e.detail
    this.setData({
      blogList:[]
    })
    this._loadBlogList()

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
    // const db = wx.cloud.database()
    // db.collection('blog').orderBy('createTime','desc').get()
    // .then(res=>{
    //   console.log(res)
    // })
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
    this.setData({
      blogList: []
    })
    this._loadBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e)
    let {blog} = e.target.dataset
    return {
      title:blog.content,
      path:'/pages/blog-comment/blog-comment?blogId='+blog._id,

    }
  }
})