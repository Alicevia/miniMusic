// miniprogram/pages/blog-comment/blog-comment.js
import formatTime from '../../utils/formatTime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog:{},
    commentList:[],
    blogId:"",
  },

  _getBlogDetail(){
    let blogId = this.data.blogId
    wx.showLoading({
      title:'加载中',
      mask:true
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        blogId,
        $url:'detail'
      }
    }).then(({result})=>{
      console.log(result)
      let commentList = result.commentList.data
      commentList = commentList.map(item=>{
        item.createTime = formatTime(new Date(item.createTime))
        return item
      })
      let blog = result.detail[0]
      blog.createTime = formatTime(new Date(blog.createTime))
      this.setData({
        commentList,
        blog
      })
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      blogId:options.blogId
    })
    this._getBlogDetail()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let {blog} = this.data
    return {
      title:blog.content,
      path:'/pages/blog-comment/blog/comment'
    }
  }
})