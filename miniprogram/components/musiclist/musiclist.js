let app = getApp()
Component({
  properties:{
    musiclist:Array
  },
  data:{
    playingId:-1
  },
  pageLifetimes:{
    show(){
      
    }
  },
  pageLifetimes:{
    show(){
      this.setData({
        playingId:app.getPlayMusicId()
      })
    }
  },
  methods:{
    onSelect(event){
      let dataset = event.currentTarget.dataset
      let playingId = dataset.musicid
      console.log(playingId,this.data.musiclist)
      console.log(typeof playingId)
      let index = dataset.index
      this.setData({
        playingId
      })
      wx.navigateTo({
        url:`../../pages/player/player?musicId=${playingId}&index=${index}`
      })
      
    }
  }
})