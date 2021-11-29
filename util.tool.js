/*
 * @since: 2021-05-11 10:08:47
 * @LastAuthor: Do not edit
 * @lastTime: 2021-11-25 15:07:16
 * @文件相对于项目的路径: \financial-sx-org-webe:\npm仓库\常用js工具库\wheelUtils\util.tool.js
 * @Author: ltm@xtoneict.com
 * @message: 工具函数
 */

const _isEqual = require('lodash/isEqual')

/**
 * @description 常用辅助函数
 * @module utils/util
 */

/**
 * @description 判断两个对象是否相等
 * @param {*} object
 * @param {*} other
 * @return {boolean}
 */
export function isEqual (object, other) {
  return _isEqual(object, other)
}

/**
 * @description 防抖函数
 * @param {function} fn 事件处理函数
 * @param {number} [delay=20] 延迟时间
 * @param {boolean} [isImmediate=false] 是否立刻执行
 * @param {object} [context=this] 上下文对象
 * @returns {Function} 事件处理函数
 */
export function debounce (fn, delay = 20, isImmediate = false, context = this) {
  // 使用闭包，保存执行状态，控制函数调用顺序
  let timer;

  return function () {
    const _args = [].slice.call(arguments)

    clearTimeout(timer);

    const _fn = function () {
      timer = null;
      if (!isImmediate) fn.apply(context, _args);
    };

    // 是否滚动时立刻执行
    const callNow = !timer && isImmediate;

    timer = setTimeout(_fn, delay);

    if (callNow) fn.apply(context, _args);
  }
}

const raFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
  return window.setTimeout(callback, 1000 / 60);
};

/**
 * @description 动画延时函数
 * @function
 * @param {function} callback 动画回调函数
 * @return {number} id
 */
export const requestAnimationFrame = raFrame

/**
 * @description 清除动画延时
 * @function
 * @param {number} id
 */
export const cancelAnimationFrame = window.cancelAnimationFrame || window.webkitRequestAnimationFrame || function (id) {
  window.clearTimeout(id);
};

/**
 * @description 节流函数
 * @param {function} fn 事件处理函数
 * @param {object} [context=this] 上下文对象
 * @param {boolean} [isImmediate=false] 是否立刻执行
 * @returns {Function} 事件处理函数
 */
export function throttle (fn, context = this, isImmediate = false) {
  let isLocked;
  return function () {
    const _args = arguments

    if (isLocked) return

    isLocked = true
    raFrame(function () {
      isLocked = false;
      fn.apply(context, _args)
    })

    isImmediate && fn.apply(context, _args)
  }
}

/**
 * @description 遍历树数据节点，查找符合条件的节点
 * @param {Array|Object} data 数据树，如 {id:1, children:[{id:2}]}
 * @param {Boolean} isFindOne 是否只找最先符合条件的一个
 * @param {Function} fn 查找回调函数，回调参数：item 节点，index节点当前兄弟节点中的索引，data 查找的数据树，函数返回true表示符合条件
 * @param {string} [field=children] 子级字段名称
 * @returns {Array|Object} 查找结果，isFindOne为true时返回Object， false时返回Array
 */
export function traverse (data = [], isFindOne, fn, field = 'children') {
  let result = []
  data = Array.isArray(data) ? data : [data]
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i],
      checked = fn(item, i, data),
      children = item[field]
    if (checked) {
      result.push(item)
      if (isFindOne) break
    }
    if (children) {
      const child = traverse(children, isFindOne, fn, field)
      if (child) result = result.concat(child)
    }
  }
  return isFindOne ? result[0] || null : result
}

/**
 * @description 生成随机GUID
 * @return {string}
 */
export function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }).toUpperCase();
}


/**
 * @description 数据脱敏处理
 * @param {string} str 原始数据
 * @returns {string} regType 数据处理类型，如：'phone','passport','houseHoldBook','foreignersResidenceCard','passForHongKongAndMacaoResidents','TaiwanResidentPass',， 默认为手机类型
 * example desensitization(12221220120229190, 'idCard') 
 * => return 122212********9190
*/
export const desensitization = (str, regType = 'phone') => {
  if (regType === 'phone' && str && str.length !== 11) { // 判断手机号是否为11位
    return str
  }
  if (
    regType === 'passport' // 护照
    || regType === 'houseHoldBook' // 户口本
    || regType === 'foreignersResidenceCard' // 外国人居留证
    || regType === 'passForHongKongAndMacaoResidents' // 港澳居民来往内地通行证
    || regType === 'TaiwanResidentPass' // 台湾居民来往大陆通行证
    || regType === 'other' // 其他

  ) {
    const regMethods = new RegExp(/\d/, 'g')
    return str.replace(regMethods, '*');
  }
  const pat = {
    orgIDNumber: /(\d{6})\d*(\d{4})/, // 身份证
    militaryCard: /(\d{1})\d*(\d{1})/, // 军人证
    armedPoliceCard: /(\d{1})\d*(\d{1})/, // 警官证
    soldierCard: /(\d{1})\d*(\d{1})/, // 士兵证
    phone: /(\d{3})\d*(\d{4})/,
    idCard: /(\d{6})\d*(\d{4})/,
  }
  return str && str.replace(pat[regType], '$1****$2')
}


/**
 * @description 数组中的最大值与最小值
 * @param {Array} array 原始数据
 * @param {string} type 如max,min,默认max
 * @returns {string} parameter 要处理的参数名
 * example getArrayForMaxMin([{"area":"GX","areaName":"高新区","count":5},{"area":"QY","areaName":"青羊区","count":4}])
 * => return 5
*/
export function getArrayForMaxMin (array, type = 'max', parameter = 'count') {
  return Math[type].apply(Math, array.map(item => item[parameter]))
}

/**
 *@description 请求接口对象遍历
 */
export function requestGetList (data) {
  let params = "?";
  for (let key in data) {
    params += key + "=" + data[key] + "&";
  }
  params = params.slice(0, params.length - 1);
  return params;
}


/**
 * @description 获取url后参数
 */
export function GetRequest () {
  let url = location.search; // 获取url中"?"符后的字串
  let theRequest = new Object();
  if (url.indexOf("?") != -1) {
    let str = url.substr(1);
    let temporaryStr = str.split("&");
    for (let i = 0; i < temporaryStr.length; i++) {
      theRequest[temporaryStr[i].split("=")[0]] = (temporaryStr[i].split("=")[1]);
    }
  }
  return theRequest;
};


/**
 * @description 生成随机颜色值
 */
export function getRandomColor () {
  const rgb = [];
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16);
    color = color.length === 1 ? "0" + color : color;
    rgb.push(color);
  }
  return "#" + rgb.join("");
};


/**
 * @description 打开新页面
 * @param {String} url 地址
 */
export function openUrl (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'xt-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('xt-link-temp'))
}


/**
 * @description 页面点击下载
 * @param {String} tempFormId 下载id
 */
export function downLoadUrl (tempFormId) {
  const tempLink = document.createElement('a');
  tempLink.href = `${process.env.VUE_APP_API
    }/api/recAuditInfo/batchAuidtDownload?contentId=${tempFormId
    }&Authorization=Bearer%20${localStorage.getItem('token')}`;
  tempLink.setAttribute('target', '_self');
  // tempLink.setAttribute('download', val.attachmentName);
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounceCharts (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}