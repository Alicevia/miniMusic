// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
let db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog:Object
  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],

  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,
    modalShow: false,
    content: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                userInfo = res.userInfo
                console.log('sdfa', userInfo)
                this.setData({
                  modalShow: true
                })
              }
            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        }
      })
    },
    onLoginSuccess(e) {
      userInfo = e.detail
      console.log('xx', userInfo)
      this.setData({
        loginShow: false,
      }, () => {
        this.setData({
          modalShow: true
        })
      })
    },
    onLoginFail() {
      wx.showModal({
        title: '只有授权用户才能评论',
        content: ''
      })
    },
    onInput(e) {
      this.setData({
        content: e.detail.value
      })
    },
    onSend(){
      let content = this.data.content
      let tmplId = '3eAOlW3uUtRIRfHrMk1I4or1u3Q8nWPZSTMa0mNq8Es'
      wx.requestSubscribeMessage({
        tmplIds: [tmplId],
        success: async (res) => {
          if (res[tmplId] == 'accept') {
            let res  = await db.collection('blog-comment').add({
              data: {
                content,
                createTime: db.serverDate(),
                blogId: this.properties.blogId,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl
              }
            }).catch(err=>{
              console.log(err)
            })
            wx.hideLoading()
            this.setData({
              modalShow: false,
              content: ''
            })
            if (res && res.errMsg.includes('ok')) {
               wx.showToast({
                title: '评论成功'
              })
              this.triggerEvent('refreshCommentList')
              wx.cloud.callFunction({
                name: 'sendMessage',
                data: {
                  content,
                  blogId: this.properties.blogId
                }
              })
            }else{
              wx.showToast({
                title:'评论失败',
                icon:'none'
              })
            }

          }
        },

      })
    },
  }
})
