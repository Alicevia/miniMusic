// pages/player/player.js
let musiclist = []
let nowPlayingIndex = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    restartAnimation: 'rotation',
    isLyricShow: false,
    lyric: '',
    isSame: false
  },
  _loadMusicDetail(musicId) {
    if (musicId === app.getPlayMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    let music = musiclist[nowPlayingIndex]
    wx.setNavigationBarTitle({
      title: music.name
    })
    this.setData({
      picUrl: music.al.picUrl
    })
    console.log('asdfasdf', typeof musicId)
    app.setPlayMusicId(musicId)
    wx.showLoading({ title: '歌曲加载中...' })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicUrl',
        musicId
      }
    }).then(res => {
      let { data } = JSON.parse(res.result)
      if (data[0].url === null) {
        wx.showToast({
          title: '无权限播放'
        })
        return
      }
      if (!this.data.isSame) {
        backgroundAudioManager.title = music.name
        backgroundAudioManager.src = data[0].url
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name
        this.savePlayHistory()
      }

      this.setData({
        isPlaying: true,
        restartAnimation: 'rotation'
      })
      wx.hideLoading()
      wx.cloud.callFunction({
        name: 'music',//调用云函数的名称
        data: {
          musicId,
          $url: 'lyric'
        }
      }).then(res => {
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if (lrc) {
          lyric = lrc.lyric
          this.setData({
            lyric
          })
        }
      })
    })
  },
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  onPrev() {
    nowPlayingIndex--
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    this.setData({
      restartAnimation: ''
    })
    console.log('xxxx', typeof musiclist[nowPlayingIndex].id)
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  onNext() {
    nowPlayingIndex++
    if (nowPlayingIndex >= musiclist.length) {
      nowPlayingIndex = 0
    }
    this.setData({
      restartAnimation: ''
    })
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },
  onPause() {
    this.setData({
      isPlaying: false
    })
  },
  savePlayHistory() {
    let music = musiclist[nowPlayingIndex]
    let openid = app.globalData.openid
    let history = wx.getStorageSync(openid)
    console.log(history)
    let bHave = false
    for (let i = 0, len = history.length; i < len; i++) {
      if (history[i].id == music.id) {
        bHave = true
        break
      }
    }
    // for (let i = 0; i < history.length; i++) {
    //   if (history[i].id === music.id) {
    //     bHave = true
    //     break
    //   }

    // }
    if (!bHave) {
      history.unshift(music)
      wx.setStorage({
        key: openid,
        data: history
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(parseInt(options.musicId))

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
  onShareAppMessage: function () {

  }
})