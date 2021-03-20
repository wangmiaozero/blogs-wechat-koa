const { client, redis } = require('../redis/index')
/*
 *检查对象是否为空 token是否过期
 */
async function isOwnEmpty(token) {
  let obj = await redis.get(token)
  let result = {}
  if (JSON.parse(obj) === null) {
    result = { flag: true, v: JSON.parse(obj) } //返回true，为空对象
  } else {
    result = { flag: false, v: JSON.parse(obj) } //返回false，不为空对象
  }
  return await result
}

module.exports = isOwnEmpty
