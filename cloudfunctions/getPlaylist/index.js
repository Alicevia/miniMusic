const cloud = require('wx-server-sdk')
const request = require('request-promise')

cloud.init()
const db = cloud.database({
  env: 'dev-ae1s9'
})
const URL = 'http://musicapi.xiecheng.live/personalized'
const playlistCollection = db.collection('playlist')
const MAX_LIMIT=100

exports.main = async (event, context) => {
  const countResult = await playlistCollection.count()
  const total = countResult.total
  const batchTimes = Math.ceil(total/MAX_LIMIT)
  const task = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i*MAX_LIMIT).limit(MAX_LIMIT)
    task.push(promise)
  }
  let list = {
    data:[]
  }
  if (task.length>0) {
   list = (await Promise.all(task)).reduce((acc,cur)=>{
     return {
       data:acc.data.concat(cur.data)
     }
   })
  }

//最新的数据
  let playlist = await request(URL).then(res => {
    return JSON.parse(res).result
  })

  let newData=[]//去重复操作
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playlist[i])
    }
  }
  for (let i = 0, len = newData.length; i < len; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log('插入成功')
    }).catch((err) => {
      console.error('插入失败')
    })
  }
  return newData.length

 
}

let a = [2,3,45,6]
a.forEach(item=>{
  console.log(item)
  return
})