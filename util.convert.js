/*
 * @since: 2021-05-11 09:59:39
 * @LastAuthor: Do not edit
 * @lastTime: 2021-06-21 08:58:02
 * @文件相对于项目的路径: \data-report-webe:\项目开发\陕西项目\financial-sx-auth-web\src\libs\util.convert.js
 * @Author: ltm@xtoneict.com
 * @message: 数据转换工具函数模块
 */

/**
 * 把列表数据转换成树结构, 列表数据必须有父节点标识
 * @param {Object[]} list 列表数组数据
 * @param {String|Number} parentId 根节点的父节点id标识
 * @param {Number} [level=0] 指定第一层级别的索引，可选，默认值：0
 * @param {Object} [map={id:'id' ,parentId:'parentId', children:'children', level:'level', order:'order'}] 属性映射, 可选
 * @param {String} map.id 节点标识
 * @param {String} map.parentId 父节点标识
 * @param {Object[]} map.children 子节点数组
 * @param {Number} map.level 层级索引
 * @param {Number} map.order 排序标识
 * @returns {Object[]} 树结构数组
 *
 * @example
 * // 基础用法
 *  let list = [{id:1, parentId:null, text:'node 1'}, {id:2, parentId:1, text:'node 2'}]
 *  let tree = listToTree(list, null)
 *  // tree： [{id:1, parentId:null, text:'node 1', level:0, children:[
 *  //           {id:2, parentId:1, text:'node 2', level:1}
 *  //           ]
 *  //        }]
 */
export function listToTree (list, parentId, level = 0, map) {
  const prop = {
    id: 'id',
    parentId: 'parentId',
    children: 'children',
    level: 'level',
    order: 'order',
    path: 'path',
    ...map
  }

  // 判断是否需要排序
  if (list.length > 0 && list[0][prop.order]) {
    list.sort((a, b) => {
      return a[prop.order] - b[prop.order]
    })
  }

  let temp = Object.create(null),
    tree = [];
  list.forEach(item => {
    temp[item[prop.id]] = item
  })


  for (let key in temp) {
    const item = temp[key]
    const pId = item[prop.parentId]
    if (pId === parentId) {
      item[prop.level] = level
      item[prop.path] = [item[prop.id]]
      tree.push(item)
    } else {
      const parent = temp[pId]
      if (parent) {
        if (!parent[prop.children]) {
          parent[prop.children] = []
        }
        const path = (parent[prop.path] || []).concat(item[prop.id])

        item[prop.level] = parent[prop.level] + 1
        item[prop.path] = path
        parent[prop.children].push(item)
      }
    }
  }
  return tree

}

/**
 * 简单 列表转换树结构
 * @param {Object[]} list 列表数据，约定字段名称： id/parentId/children
 * @param {*} [parentId=null] 父节点的值
 * @param {string} [idKey=id] id字段名称
 * @param {string} [parentIdKey=parentId] parentId字段名称
 * @return {Array}
 */
export function buildTree (list = [], parentId = null, idKey = 'id', parentIdKey = 'parentId') {
  let temp = Object.create(null),
    tree = []
  list.forEach(item => {
    temp[item[idKey]] = {
      ...item
    }
  })

  for (let key in temp) {
    const item = temp[key]
    if (item[parentIdKey] === parentId) {
      tree.push(item)
    } else {
      const parent = temp[item[parentIdKey]]
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(item)
      }
    }
  }

  return tree
}

/**
 * 列表数据转换成表格数结构（不建议再使用），请使用 [listToTree]{@link module:utils/convert.listToTree}
 * @deprecated
 * @param {Object[]} list 列表数组数据
 * @param {String|Number} parentId 根节点的父节点id标识
 * @param {Number} [level=0] 指定第一层级别的索引，可选，默认值：0
 * @param {Object} [prop={id:'id' ,parentId:'parentId', children:'children', level:'level', order:'order'}] 属性映射, 可选
 * @param {String} prop.id 节点标识
 * @param {String} prop.parentId 父节点标识
 * @param {Object[]} prop.children 子节点数组
 * @param {Number} prop.level 层级索引
 * @param {Number} prop.order 排序标识
 * @returns {Object[]} 树结构数组
 * @see [utils/convert.listToTree]{@link module:utils/convert.listToTree}
 */
export function listToTableTree (list, parentId, level = 0, prop = {
  id: 'id',
  parentId: 'parentId',
  children: 'children',
  level: 'level',
  order: 'order'
}, idPath) {
  let temp, result = []
  if (!list || list.length === 0) {
    return result
  }
  list.forEach(item => {
    if (item[prop.parentId] === parentId) {
      let obj = Object.assign({}, item)
      obj[prop.level] = level
      obj.idPath = (idPath || '') + '_' + item[prop.id]
      result.push(obj)
      temp = listToTableTree(list, obj[prop.id], level + 1, prop, obj.idPath)
      if (temp.length > 0) {
        result = result.concat(temp)
      }
    }
  })
  return result.sort((a, b) => {
    return a[prop.order] - b[prop.order]
  })
}

/**
 * 深度拷贝对象或数组，采用JSON.parse 和 JSON.stringify 实现, 相同功能的方法 [deepCop]{@link module:utils/convert.deepCopy}
 * @param {Object|Array} obj 要拷贝的对象或数组
 * @returns {Object|Array} 拷贝后的对象副本
 */
export function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key);
};

/**
 * 检测数据类型
 * @param {*} obj 需要检测的数据
 * @returns {string} boolean / number / string / function / array / date / regExp / undefined / null / object
 */
export function typeOf (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

export const utilConvert = {
  trim: function (text) {
    return text == null ?
      "" :
      text.toString().replace(/^\s+/, "").replace(/\s+$/, "");
  },
  type (o) {
    return typeOf(o);
  },
  /**
   * 测试对象是否是窗口（有可能是Frame）
   */
  isWindow (o) {
    return o != null && o == o.window;
  },
  /**
   * 测试对象是否是布尔（Boolean）类型值
   */
  isBoolean (o) {
    return typeOf(o) == "boolean";
  },
  /**
   * 测试对象是否是字符串（String）类型值
   */
  isString (o) {
    return typeOf(o) == "string";
  },
  /**
   * 测试对象是否是日期（Date）类型值
   */
  isDate (o) {
    return typeOf(o) == "date";
  },
  /**
   * 测试对象是否是正则表达式（RegExp）
   */
  isRegExp (o) {
    return typeOf(o) == "regexp";
  },
  /**
   * 测试传入的参数是否是一个 javascript 对象
   */
  isObject (o) {
    return typeOf(o) == "object";
  },
  /**
   * 测试对象是否是数组（Array）
   */
  isArray (o) {
    return typeOf(o) == "array";
  },
  /**
   * 测试对象是否是函数
   */
  isFunction (o) {
    return typeOf(o) == "function";
  },
  /**
   * 判断对象是否是数值类型
   */
  isNumber (o) {
    return typeOf(o) == "number";
  },
  /**
   * 判断对象是否为空(Null)值
   */
  isNull (o) {
    return o === null;
  },
  /**
   * 判断对象是否为 "未定义" 值(即 undefined)
   */
  isUndefined (o) {
    return o === undefined || typeof o === "undefined";
  },
  /**
   * 判断对象是否为 "未定义" 值(即 undefined)或空(Null)值
   */
  isNullOrUndefined (o) {
    return utilConvert.isNull(o) || utilConvert.isUndefined(o);
  },
  isPlainObject (o) {
    if (!obj || utilConvert.type(obj) !== "object" || obj.nodeType || utilConvert.isWindow(obj)) {
      return false;
    }
    try {
      // Not own constructor property must be Object
      if (obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
      }
    } catch (e) {
      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }
  },
  /**
   * 判断传入的字符串是否为Null或者为空字符串
   */
  isNullOrEmpty (str) {
    return str === undefined || str === null || str === "";
  },
  /**
   * 判断传入的字符串是否为Null或者为空字符串或者全是空格
   */
  isNullOrWhiteSpace (str) {
    return utilConvert.isNullOrEmpty(str) || utilConvert.trim(str) === "";
  },
  isEmptyObject (obj) {
    if (!obj) return false;
    for (var name in obj) {
      return false;
    }
    return true;
  },
  /**
   * 测试对象是否为空（不包含任何属性的空对象、null、undefined、空字符串、全空格）。
   * 这个方法既检测对象本身的属性，也检测从原型继承的属性（因此没有使用hasOwnProperty）。
   */
  isEmptyObjectOrNull: function (obj) {
    switch (utilConvert.type(obj)) {
      case "string":
        return utilConvert.isNullOrWhiteSpace(obj);
      case "array":
        return obj.length === 0;
      case "date":
        return Date.parse(obj) === 0;
      case "object":
        return utilConvert.isEmptyObject(obj);
    }
    return obj == null || obj == undefined;
  },
  getElementPos (target) {
    var pos = {
      x: 0,
      y: 0
    };
    while (target) {
      pos.x += target.offsetLeft;
      pos.y += target.offsetTop;
      target = target.offsetParent;
    }
    return pos;
  },
  // 计算时间差
  computedTime (strDateStart, strDateEnd, strSeparator) {
    if (strSeparator == undefined) {
      var strSeparator = "-"; // 日期分隔符
    }
    var oDate1;
    var oDate2;
    var iDays;
    oDate1 = strDateStart.split(strSeparator);
    oDate2 = strDateEnd.split(strSeparator);
    var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
    var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
    iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24); // 把相差的毫秒数转换为天数
    return iDays;
  },
  // 设置时间
  setDate (endDate, startDate) {
    var newDate = new Date(endDate);
    var start = new Date(startDate);
    var D = newDate.getDate();
    var S = start.getDate();
    var aDate = [];
    for (var i = S; i <= D; i++) {
      aDate.push([i] + "日");
    }
    return aDate;
  },
  /**
 * 深度拷贝对象或数据
 * @param {*} data 需要拷贝的数据
 * @returns {*} 拷贝后的数据副本
 * @see [clone]{@link module:utils/convert.clone}
 */
  deepCopy: function copy (obj) {
    var str;
    var newObj = obj.constructor === Array ? [] : {};
    if (typeof obj !== "object") {
      return;
    } else if (window.JSON) {
      str = JSON.stringify(obj), // 系列化对象
        newObj = JSON.parse(str); // 还原
    } else {
      for (var i in obj) {
        newObj[i] = typeof obj[i] === "object" ?
          cloneObj(obj[i]) : obj[i];
      }
    }
    return newObj;
  },
  // 数字转为中文
  EnglishConvert: function (num) {
    num = num.toString();
    var china = new Array("一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
    var arr = new Array();
    var english = num.split("");
    for (var i = 0; i < english.length; i++) {
      arr[i] = china[english[i]];
    };
    return arr.join("");
  },
  // 时间戳转时间 yyyy-mm-dd HH:mm:ss
  formatDateTime: function (timeStamp) {
    // var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var date = new Date(timeStamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ("0" + m) : m;
    var d = date.getDate();
    d = d < 10 ? ("0" + d) : d;
    var h = date.getHours();
    h = h < 10 ? ("0" + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ("0" + minute) : minute;
    second = second < 10 ? ("0" + second) : second;
    // return y + '-' + m + '-' + d +' '+h+':'+minute+':'+second;
    return y + "年" + m + "月" + d + "日 " + h + ":" + minute;
  },
  // 对象遍历
  getList (data) {
    let params = "?";
    for (let key in data) {
      params += key + "=" + data[key] + "&";
    }
    params = params.slice(0, params.length - 1);
    return params;
  },
  // 替换全局所有
  replaceAll (str, regExp, target) {
    let reg = new RegExp(regExp, "g");
    return str.replace(reg, target);
  },
  // 统计数组中对象出现的次数；
  countTimes (arr) {
    let counts = {};
    arr.map((item) => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return counts;
  },
  // 数组中的多行数字模糊搜索
  queryArrKeys (arr, q) {
    return arr.filter(v => Object.values(v["serveName"]).some(v => new RegExp(q + "").test(v)));
  }

};


/**
 * 对数组按制定字段名称进行分组
 * @param {Array} data 数组数组
 * @param {string} [field=group] 分组字段名称
 * @returns {object} 结果
 *
 * @example
 * [{name:1, group:'a'},{name:2, group:'a'}, {name:3, group:'b'}]  ->
 * {
 *  'a':[{name:1, group:'a'}, {name:2, group:'a'}]
 *  'b': [{name:3, group:'b'}]
 * }
 */
export function grouping (data = [], field = 'group') {
  let result = {
    'default': []
  }
  data.forEach(item => {
    let group = item[field]
    if (group) {
      if (!result[group]) {
        result[group] = []
      }
      result[group].push(item)
    } else {
      result['default'].push(item)
    }
  })
  return result
}