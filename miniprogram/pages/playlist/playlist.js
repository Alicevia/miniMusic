// pages/playlist/playlist.js
import regeneratorRuntime from '../../utils/runtime'
const MAX_LIMIT = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [
      {
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playlist: []
  },

  _getPlaylist() {
    wx.showLoading({
      title: '加载中...'
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'playlist'
      }
    }).then(({ result: { data } }) => {
      this.setData({
        playlist: this.data.playlist.concat(data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  getMusicInfo() {
    wx.cloud.callFunction({
      name: 'tcbRouter',
      data: {
        $url: 'music'
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getPlaylist()
    this.getMusicInfo()
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
      playlist: []
    })
    this._getPlaylist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

