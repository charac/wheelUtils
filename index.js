/*
 * @since: 2021-11-22 14:21:01
 * @LastAuthor: Do not edit
 * @lastTime: 2021-11-30 10:00:21
 * @文件相对于项目的路径: \financial-sx-sso-webe:\npm仓库\常用js工具库\wheelUtils\index.js
 * @Author: ltm@xtoneict.com
 * @message: 工具库
 */
import cookies from './util.cookies'
// import db from './util.db'
import log from './util.log'
export * from './util.convert'
export * from './util.tool'
export * from './util.globals'
export * from './util.localStorage'

const util = {
  cookies,
  // db,
  log
}


/**
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = (path) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}


/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'D2Admin'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

util.confirm = function (vm, info, confirmCallback) {
  vm.$confirm(info, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(confirmCallback).catch(() => { })
}

util.getDurationText = function (millisecond) {
  const secondTime = parseInt(millisecond / 1000)
  let durationText = ''
  let second = 0
  let minute = 0
  let hour = 0
  if (secondTime >= 60) {
    second = secondTime % 60
    const minuteTime = parseInt(secondTime / 60)
    if (minuteTime >= 60) {
      minute = minuteTime % 60
      hour = parseInt(minuteTime / 60)
    } else {
      minute = minuteTime
    }
  } else {
    second = secondTime
  }
  if (hour > 0) {
    durationText += hour + '小时'
  }
  if (minute > 0) {
    durationText += minute + '分'
  }
  if (second > 0) {
    durationText += second + '秒'
  }
  return durationText
}

export default util
