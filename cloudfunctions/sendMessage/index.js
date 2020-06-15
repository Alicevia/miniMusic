// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
 const {OPENID}=cloud.getWXContext()
 let res =await cloud.openapi.subscribeMessage.send({
    touser:OPENID,
    page:`/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data:{
      phrase1:{
        value:'评论完成'
      },
      thing2:{
        value:event.content
      }
    },
    templateId:'3eAOlW3uUtRIRfHrMk1I4or1u3Q8nWPZSTMa0mNq8Es',
    // formId:event.formId
  
 })
 return res
}