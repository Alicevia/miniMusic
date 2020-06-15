// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow:Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 授权之后获取到的结果
    onGetUserInfo(event){
      console.log('event',event)
      let userInfo = event.detail.userInfo
      if (userInfo) {
        this.setData({
          modalShow:false
        })
        this.triggerEvent('loginsuccess',userInfo)
        console.log('triggleok')
      }else{
        this.triggerEvent('loginfail')
        console.log('trigglefk')
      }
    }
  }
})
