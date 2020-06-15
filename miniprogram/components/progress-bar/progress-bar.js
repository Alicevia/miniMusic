let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let tempTime = -1
let isMoving = false
Component({
  properties: {
    isSame:Boolean
  },
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    progress: 0
  },
  methods: {
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(rect => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        isMoving=false
        this.triggerEvent('musicPlay')
      })
      backgroundAudioManager.onPause(()=>{
        this.triggerEvent('musicPause')

      })
      backgroundAudioManager.onStop(() => {
        // this.triggerEvent('musicStop')
      })
      backgroundAudioManager.onWaiting(() => {

      })
      //可以播放但是后续不一定是流畅
      backgroundAudioManager.onCanplay(() => {

        if (typeof backgroundAudioManager.duration != 'undefined') {
          this._setTime(backgroundAudioManager.duration, ({ min, sec }) => {
            this.setData({
              'showTime.totalTime': `${min}:${sec}`
            })
          })
        } else {
          setTimeout(() => {
            this._setTime(backgroundAudioManager.duration, ({ min, sec }) => {
              this.setData({
                'showTime.totalTime': `${min}:${sec}`
              })
            })
          }, 1000)

        }
      })
      backgroundAudioManager.onSeeking(()=>{
      })
      backgroundAudioManager.onSeeked(()=>{
      })
      backgroundAudioManager.onTimeUpdate(() => {
        if (isMoving) {
          return
        }

        let duration = backgroundAudioManager.duration
        let currentTime = backgroundAudioManager.currentTime
        let progress = (currentTime / duration) * 100
        let movableDis = (currentTime / duration) * (movableAreaWidth - movableViewWidth)
        let second = currentTime.toString().split('.')[0]
        if (second != tempTime) {
          let { min, sec } = this._dateFormat(currentTime)
          this.setData({
            'showTime.currentTime': `${min}:${sec}`,
            movableDis,
            progress
          })
          tempTime = second
          this.triggerEvent('timeUpdate',{currentTime})
        }
      })
      backgroundAudioManager.onEnded(() => {
        this.setData({
          showTime: {
            currentTime: '00:00',
            totalTime: '00:00'
          },
          movableDis: 0,
          progress: 0
        })
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onError(() => {
        wx.showToast({ title: '音乐播放错误' })
      })
    },
    _setTime(duration, callback) {
      let { min, sec } = this._dateFormat(duration)
      callback && callback({ min, sec })
    },
    _dateFormat(time) {
      let min = Math.floor(time / 60)
      let sec = Math.floor(time % 60)
      if (sec < 10) {
        sec = '0' + sec
      }
      if (min < 10) {
        min = '0' + min
      }
      return { min, sec }
    },
    onChange(e) {
      let { source, x } = e.detail
      if (source === 'touch') {
        isMoving = true
        let percent = x / (movableAreaWidth - movableViewWidth)
        let progress = percent * 100
        let movableDis = x
        this.data.progress = progress
        this.data.movableDis = movableDis
      }
    },
    onTouchEnd() {
      isMoving = true
      let duration = backgroundAudioManager.duration
      let currentTime = duration * (this.data.progress / 100)
      let { min, sec } = this._dateFormat(currentTime)
      console.log('end')
      backgroundAudioManager.seek(currentTime)
      this.setData({
        'showTime.currentTime': `${min}:${sec}`,
        movableDis: this.data.movableDis,
        progress: this.data.progress
      })
    },

  },

  lifetimes: {
    ready() {
      // 组件布局完成之后执行
      if (this.properties.isSame && this.data.showTime.totalTime) {
        this._setTime(backgroundAudioManager.duration, ({ min, sec }) => {
          this.setData({
            'showTime.totalTime': `${min}:${sec}`
          })
        })
      }
      this._getMovableDis()
      this._bindBGMEvent()
    }
  }
})