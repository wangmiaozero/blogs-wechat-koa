const cluster = require('cluster')
const os = require('os')
const numCPUs = os.cpus().length
const cpus = os.cpus()
const totalMem = os.totalmem();//内存
const freeMem = os.freemem();
const uptime = os.uptime();//系统开机时间
const config = require('./config/index') // mysql配置
const app = require('./main')
const http = require('http')
const https = require('https')
const fs = require('fs')

var dealMem = (mem)=>{
  var G = 0,
      M = 0,
      KB = 0;
  (mem>(1<<30))&&(G=(mem/(1<<30)).toFixed(2));
  (mem>(1<<20))&&(mem<(1<<30))&&(M=(mem/(1<<20)).toFixed(2));
  (mem>(1<<10))&&(mem>(1<<20))&&(KB=(mem/(1<<10)).toFixed(2));
  return G>0?G+'G':M>0?M+'M':KB>0?KB+'KB':mem+'B';
};

var dealTime = (seconds)=>{
  var seconds = seconds|0;
  var day = (seconds/(3600*24))|0;
  var hours = ((seconds-day*3600)/3600)|0;
  var minutes = ((seconds-day*3600*24-hours*3600)/60)|0;
  var second = seconds%60;
  (day<10)&&(day='0'+day);
  (hours<10)&&(hours='0'+hours);
  (minutes<10)&&(minutes='0'+minutes);
  (second<10)&&(second='0'+second);
  return [day,hours,minutes,second].join(':');
};

if (cluster.isMaster) {
  //cpu
  console.log('*****cpu信息*******');
  cpus.forEach((cpu,idx,arr)=>{
    var times = cpu.times;
    console.log(`cpu${idx}：`);
    console.log(`型号：${cpu.model}`);
    console.log(`频率：${cpu.speed}MHz`);
    console.log(`使用率：${((1-times.idle/(times.idle+times.user+times.nice+times.sys+times.irq))*100).toFixed(2)}%`);
  });
  console.log( `循环 fork 任务  主线程运行在${process.pid}`)

  console.log("内存大小："+dealMem(totalMem)+' 空闲内存：'+dealMem(freeMem));
 
  console.log(`主进程 ${process.pid} 正在运行`)

  console.log("开机时间："+dealTime(uptime));
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
      `server running at http://${config.ip}:${config.port}\n服务器,已启动!`
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
