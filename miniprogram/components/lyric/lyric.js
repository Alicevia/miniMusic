let lrcHeight=0
Component({
  properties:{
    isLyricShow:{
      type:Boolean,
      value:false
    },
    lyric:String
  },
  observers:{
    lyric(lrc){
      if (lrc==='暂无歌词') {
        this.setData({
          lrcList:[{lrc,time:0}],
          nowLyricIndex:-1
        })
      }else{
        this._parseLyric(lrc)

      }
    }
  },
  data:{
    lrcList:[],
    nowLyricIndex:0,
    scrollTop:0
  },
  lifetimes:{
    ready(){
      wx.getSystemInfo({
        success(res){
          lrcHeight=res.screenWidth/750*64
        }
      })
    }
  },
  methods:{
    update(currentTime){
      let lrcList = this.data.lrcList
      console.log(lrcList)
      if (lrcList.length===0) {
        return
      }
      if (currentTime>lrcList[lrcList.length-1].time) {
        if (this.data.nowLyricIndex!==-1) {
          this.setData({
            nowLyricIndex:-1,
            scrollTop:lrcList.length*lrcHeight
          })
        }
      }
      for (let i = 0; i < lrcList.length; i++) {
        // console.log(lrcList[i])
        if (currentTime<=lrcList[i].time) {
          
          this.setData({
            nowLyricIndex:i-1,
            scrollTop:(i-1)*lrcHeight
          })
          break
        }
        
      }
      // console.log('lyric',currentTime)
    },
    _parseLyric(sLyric){
      let line = sLyric.split('\n')
      console.log(line)
      let _lrcList=[]
      line.forEach(item=>{
        let time = item.match(/\[(\d{2,}:(\d{2})(?:\.(\d{2,3}))?)]/g)
        if (time!=null) {
          let lrc = item.split(time)[1]
          let timeReg = time[0].match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?\]/)
          let time2Second = parseInt(timeReg[1])*60+parseInt(timeReg[2])+parseInt(timeReg[3])/1000
          _lrcList.push({
            lrc,time:time2Second
          })
        }
      })
      this.setData({
        lrcList:_lrcList
      })
      console.log(line)
    }
  }
})