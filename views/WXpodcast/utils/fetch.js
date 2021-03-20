/*
 * @Description: 
 * @Version: 0.1
 * @Autor: wangmiao
 * @Date: 2021-03-20 22:05:53
 * @LastEditors: wangmiao
 * @LastEditTime: 2021-03-20 23:37:18
 */
const API_URL = 'http://127.0.0.1:2333'
function Get(url, params) {
  var token = wx.getStorageSync('token') ? wx.getStorageSync('token') : ''
  let promise = new Promise(function(resolve, reject) {
    wx.request({
      url: API_URL + url,

      data: params,

      method: 'GET',

      header: {
        'Content-Type': 'application/json',
        token: token
      },
      success: res => {
        resolve(res.data)
      },
      fail: res => {
        reject(res.data)
      }
    })
  })
  return promise
}

function Post(url, params) {
  var token = wx.getStorageSync('token') ? wx.getStorageSync('token') : ''
  let promise = new Promise(function(resolve, reject) {
    wx.request({
      url: API_URL + url,
      data: params,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        token: token
      },
      success: res => {
        resolve(res.data)
      },
      fail: res => {
        reject(res.data)
      }
    })
  })
  return promise
}
function JsonPost(url, params) {
  var token = wx.getStorageSync('token') ? wx.getStorageSync('token') : ''
  let promise = new Promise(function(resolve, reject, token) {
    wx.request({
      url: API_URL + url,
      data: JSON.stringify(params),
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        token: token
      },
      success: res => {
        resolve(res.data)
      },
      fail: res => {
        reject(res.data)
      }
    })
  })
  return promise
}
module.exports = {
  Get,
  Post,
  JsonPost
}
