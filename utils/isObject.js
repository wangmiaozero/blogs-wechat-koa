function isObj(obj) {
  for (var key in obj) {
    return false
  }
  return true
}
// 空对象true
module.exports = isObj
