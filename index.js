const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const config = require('./config/index') // mysql配置
const app = require('./main')
const http = require('http')
const https = require('https')
const fs = require('fs')
if (cluster.isMaster) {
  console.log(
    `循环 fork 任务 CPU i3 8100 四核四进程 主线程运行在${process.pid}`
  )
  console.log(`主进程 ${process.pid} 正在运行`)
  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork()
    worker.on('exit', (code, signal) => {
      if (signal) {
        console.log(`工作进程已被信号 ${signal} 杀死`)
        cluster.fork()
      } else if (code !== 0) {
        console.log(`工作进程退出，退出码: ${code}`)
      } else {
        console.log('工作进程成功退出')
      }
    })
    worker.on('online', () => {
      worker.send('worker is online')
      // console.log('worker is online')
    })
  }
  //worker: cluster.Worker, code: number, signal: string
  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`)
  })
  cluster.on('message', (worker, msg, handle) => {
    console.log(handle)
    console.log(worker.id + '', msg)
  })
  // 当前如果是工作线程
} else {
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是 HTTP 服务器。
  // Configuare https
  let httpsServer = {
    key: fs.readFileSync('./ssl/2_wechat.wangmiaozero.cn.key'),
    cert: fs.readFileSync('./ssl/1_wechat.wangmiaozero.cn_bundle.crt')
  }
  console.log(`工作进程 ${process.pid} 已启动`)
  app.listen(config.port, config.ip, () => {
    console.log(
      `server running at http://${config.ip}:${config.port}\n服务器,已启动! http://${config.ip}:${process.pid}`
    )
  })
  /*  https
    .createServer(httpsServer, app.callback())
    .listen(config.port, config.ip, () => {
      console.log(
        `server running at https://${config.ip}:${config.port}\n服务器,已启动! https://${config.ip}:${process.pid}`
      )
    }) */
  process.on('message', msg => {
    console.log('Message from Master ' + msg)
    process.send('Message from Master ' + msg)
  })
}
