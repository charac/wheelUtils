/*
 * @since: 2021-06-25 16:38:19
 * @LastAuthor: Do not edit
 * @lastTime: 2021-06-25 17:13:41
 * @文件相对于项目的路径: \data-report-webe:\项目开发\陕西项目\financial-sx-auth-web\src\libs\util.localStorage.js
 * @Author: ltm@xtoneict.com
 * @message: localStorage存储
 */

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
}

/**
* 获取localStorage
*/
export const getStoreForJson = name => {
  if (!name) return;
  var content = window.localStorage.getItem(name);
  return JSON.parse(content);
}

/**
* 删除localStorage
*/
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}


/**
* 删除所有localStorage
*/
export const removeAllStore = () => {
  window.localStorage.clear();
}
