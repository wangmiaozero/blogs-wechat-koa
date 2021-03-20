function createdTime() {
  var now = new Date()
  let year = now.getFullYear() //得到年份
  let month = now.getMonth() //得到月份
  let date = now.getDate() //得到日期
  let day = now.getDay() //得到周几
  let hour = now.getHours() //得到小时
  let minu = now.getMinutes() //得到分钟
  let sec = now.getSeconds() //得到秒
  var MS = now.getMilliseconds() //获取毫秒
  let week
  month = month + 1
  if (month < 10) month = '0' + month
  if (date < 10) date = '0' + date
  if (hour < 10) hour = '0' + hour
  if (minu < 10) minu = '0' + minu
  if (sec < 10) sec = '0' + sec
  if (MS < 100) MS = '0' + MS
  let arr_week = new Array(
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  )
  week = arr_week[day]
  let time = `${year}年${month}月${date}日${' '}${hour}${':'}${minu}${':'}${sec}${' '}${week}`
  let timeOne = `${year}-${month}-${date}${' '}${hour}${':'}${minu}${':'}${sec}${' '}${week}`
  let timeTwo = `${year}-${month}-${date}${' '}${hour}${':'}${minu}${':'}${sec}`
  let presenTdate = `${year}-${month}-${date}`
  let data = {
    time: time,
    timeOne: timeOne,
    timeTwo: timeTwo,
    now: new Date(now).getTime(),
    presenTdate: presenTdate
  }
  return data
}
function formatDateFn(now) {
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let date = now.getDate()
  let hour = now.getHours()
  let minute = now.getMinutes()
  let second = now.getSeconds()
  let MS = now.getMilliseconds() //获取毫秒
  if (month < 10) month = '0' + month
  if (date < 10) date = '0' + date
  if (hour < 10) hour = '0' + hour
  if (minute < 10) minute = '0' + minute
  if (second < 10) second = '0' + second
  let time =
    year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
  let timeOne = year + '-' + month + '-' + date
  let data = { time, timeOne }
  return data
}
module.exports = { createdTime, formatDateFn }
