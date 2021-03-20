// redis配置参数
const redis = require('redis')
const config = require('../config/index')
;(dbConfig = config.redis),
  (RDS_PORT = dbConfig.port), //端口号
  (RDS_HOST = dbConfig.host), //服务器IP
  (RDS_PWD = dbConfig.pass), //密码
  (RDS_OPTS = { auth_pass: RDS_PWD }),
  (client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS))

async function get(key) {
  return new Promise((resovle, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      resovle(reply)
    })
  })
}
async function set(key, value) {
  return new Promise((resovle, reject) => {
    client.set(key, value, (err, reply) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      resovle(reply)
    })
  })
}
module.exports = { client, redis: { get, set } }
