// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()

const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  app.router('list', async (ctx, next) => {
    let w = {}
    const keyword = event.keyword
    if (keyword.trim() != '') {
      w = {
        content: cloud.database().RegExp({
          regexp: keyword,
          options: 'i'
        })
      }
    }
    ctx.body = await cloud.database().collection('blog')
      .where(w)
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res.data
      })
  })
  app.router('detail', async (ctx, next) => {
    let blogId = event.blogId
    let blog = cloud.database().collection('blog')
    let detail = await blog.where({
      _id: blogId
    }).get().then(res => res.data)
    const countResult = await blog.count()
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const task = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = cloud.database().collection('blog-comment').skip(i * MAX_LIMIT).limit(MAX_LIMIT)
          .where({ blogId }).orderBy('createTime', 'desc').get()
        task.push(promise)

      }
      if (task.length > 0) {
        commentList = await (await Promise.all(task)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
      ctx.body = {
        commentList, detail
      }
    }

  })

  return app.serve()

}