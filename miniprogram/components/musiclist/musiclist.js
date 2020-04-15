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
  methods:{
    onSelect(event){
      let dataset = event.currentTarget.dataset
      let playingId = dataset.musicid
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