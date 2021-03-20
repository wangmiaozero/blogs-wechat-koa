/*
 * @Description: 
 * @Version: 0.1
 * @Autor: wangmiao
 * @Date: 2021-03-20 22:05:53
 * @LastEditors: wangmiao
 * @LastEditTime: 2021-03-20 23:27:37
 */
const config = {
  ip: '127.0.0.1',
  port: 2333,
  database: {
    HOST: '127.0.0.1', // 数据库地址
    USER: 'root', // 数据库用户
    PORT: 3306,
    PASSWORD: '', // 数据库密码
    DATABASE: 'wechat' // 选中数据库
  },
  redis: {
    host: '127.0.0.1',
    port: 6379
    // pass: 'wangmiao11111'
  }
}
module.exports = config
