/*
 * @since: 2021-06-25 16:34:47
 * @LastAuthor: Do not edit
 * @lastTime: 2021-11-22 14:29:25
 * @文件相对于项目的路径: \financial-sx-org-webe:\npm仓库\常用js工具库\wheelUtils\util.globals.js
 * @Author: ltm@xtoneict.com
 * @message: 
 */
import { setStore, removeStore, getStoreForJson, utilConvert } from './index'

let globals = {
  get token () {
    return getStoreForJson("token");
  },
  set token (val) {
    if (utilConvert.isString(val)) {
      setStore("token", val);
    } else {
      removeStore("token");
    }
  },
  get permissionButton () {
    return getStoreForJson("permissionButton") || [];
  },
  set permissionButton (val) {
    if (utilConvert.isArray(val)) {
      setStore("permissionButton", val);
    } else {
      removeStore("permissionButton");
    }
  }
};
export default globals;