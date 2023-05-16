(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    var HOOKS = ['beforeCreated', 'created', 'beforeMounted', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];

    // 策略模式
    var starts = {};
    starts.data = function (parentVal, childVal) {
      return childVal;
    };
    // starts.computed = function() {}
    // starts.watch = function() {}
    // starts.methods = function() {}
    starts.components = function (parentVal, childVal) {
      var obj = Object.create(parentVal);
      if (childVal) {
        for (var key in childVal) {
          obj[key] = childVal[key];
        }
      }
      return obj;
    };
    HOOKS.forEach(function (hook) {
      starts[hook] = mergeHook;
    });
    function mergeHook(parentVal, childVal) {
      if (childVal) {
        if (parentVal) {
          return parentVal.concat(childVal);
        } else {
          return [childVal];
        }
      } else {
        return parentVal;
      }
    }
    function mergeOptions(parent, child) {
      // console.log(parent, child)
      // Vue.options={created:[a,b,c], data:[a,b,c]}
      var options = {};
      for (var key in parent) {
        mergeField(key);
      }
      for (var _key in child) {
        mergeField(_key);
      }
      function mergeField(key) {
        // 策略模式
        if (starts[key]) {
          options[key] = starts[key](parent[key], child[key]);
        } else {
          options[key] = child[key] || parent[key];
        }
      }
      return options;
    }

    function initGlobalApi(Vue) {
      Vue.options = {};
      Vue.mixin = function (mixinOptions) {
        // 对象的合并
        this.options = mergeOptions(this.options, mixinOptions);
        // console.log(this.options, 99)
      };
      // 组件
      Vue.options.components = {}; // 放全局组件
      Vue.component = function (id, componentDef) {
        componentDef.name = componentDef.name || id;
        componentDef = this.extend(componentDef); // 返回一个实例
        this.options.components[id] = componentDef;
      };
      // 核心 创建一个子类
      Vue.extend = function (options) {
        var Super = this;
        var Sub = function vueComponent(opts) {
          // new Sub().$mount()
          // 初始化
          this._init(opts);
        };
        // 子组件继承父组件中的属性
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        // 将负组件中的属性合并到子组件中
        Sub.options = mergeOptions(Super.options, options);
        console.log(this.options);
        return Sub;
      };
    }

    function _iterableToArrayLimit(arr, i) {
      var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
      if (null != _i) {
        var _s,
          _e,
          _x,
          _r,
          _arr = [],
          _n = !0,
          _d = !1;
        try {
          if (_x = (_i = _i.call(arr)).next, 0 === i) {
            if (Object(_i) !== _i) return;
            _n = !1;
          } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
        } catch (err) {
          _d = !0, _e = err;
        } finally {
          try {
            if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
    }
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }

    /**
     * div id="app">hello - {{msg}}<h1></h1></div>
     * render() {
     *  return _c('div', {id: 'app'}, _v('hello' + _s(msg)), _c(h1))
     * }
     */
    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{}}

    function genProps(attrs) {
      var str = '';
      var _loop = function _loop() {
        var attr = attrs[i];
        if (attr.name === 'style') {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              val = _item$split2[1];
            obj[key] = val;
          });
          attr.value = obj;
        }
        // 拼接
        str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
      };
      for (var i = 0; i < attrs.length; i++) {
        _loop();
      }
      return "{".concat(str.slice(0, -1), "}"); // 删除最后的逗号
    }

    function genChildren(el) {
      var children = el.children;
      if (children) {
        return children.map(function (child) {
          return gen(child);
        }).join(',');
      }
    }
    function gen(node) {
      // 两种类型 文本和元素
      if (node.type === 1) {
        // 元素递归调用
        return generate(node);
      } else {
        // 文本 区分是否有{{}}
        var text = node.text;
        if (!defaultTagRE.test(text)) {
          return "_v(".concat(JSON.stringify(text), ")");
        }
        // 有{{}} hello {{name}}, {{msg}} 你好
        var tokens = [];
        var lastIndex = defaultTagRE.lastIndex = 0; // 正则表达式test以后lastIndex会变大
        var match;
        while (match = defaultTagRE.exec(text)) {
          // console.log(match)
          var index = match.index;
          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join('+'), ")");
      }
    }
    function generate(el) {
      // console.log(el)
      // 需要处理style的属性{id: 'app', style: {color:red,font-szie: 20px}}
      var children = genChildren(el);
      var code = "_c('".concat(el.tag, "', ").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
      // console.log(code)
      return code;
    }

    /**
     * ast抽象语法树：css,js,html都可以表示
     *  <div id="app">hello - {{msg}}<h1></h1></div>
     *  {
     *     tag: 'div',
     *     attrs: [{id: 'app'},...],
     *     children: [{tag: null, text: hello},{tag: h1,...}]
     *  }
     */

    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名称
    var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"; // <span:xx>的标签
    var startTagOpen = new RegExp("^<" + qnameCapture); // 标签开头的正则
    var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>"); // 标签结尾的正则
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 属性匹配
    var startTagClose = /^\s*(\/?)>/; // 匹配结束的 >

    // // 创建ast语法树
    // function createAstElement(tag, attrs) {
    //     return {
    //         tag,
    //         attrs,
    //         children: [],
    //         type: 1,
    //         parent: null
    //     }
    // }
    // let root
    // let currentParent // 当前父元素
    // let stack = [] // 栈结构用来确定当前的父元素是哪一个
    // // 开始标签
    // function start(tag, attrs) {
    //     let element = createAstElement(tag, attrs)
    //     if (!root) {
    //         root = element
    //     }
    //     currentParent = element
    //     stack.push(element)
    // }
    // // 文本
    // function charts(text) {
    //     text = text.replace(/\s/g, '')
    //     if(text) {
    //         currentParent.children.push({
    //             type: 3,
    //             text
    //         })
    //     }
    // }
    // // 结束标签
    // function end(tag) {
    //     let element = stack.pop()
    //     currentParent = stack[stack.length - 1]
    //     if (currentParent) {
    //         element.parent = currentParent.tag
    //         currentParent.children.push(element)
    //     }
    // }
    function parseHTML(html) {
      // 创建ast语法树
      function createAstElement(tag, attrs) {
        return {
          tag: tag,
          attrs: attrs,
          children: [],
          type: 1,
          parent: null
        };
      }
      var root;
      var currentParent; // 当前父元素
      var stack = []; // 栈结构用来确定当前的父元素是哪一个
      // 开始标签
      function start(tag, attrs) {
        var element = createAstElement(tag, attrs);
        if (!root) {
          root = element;
        }
        currentParent = element;
        stack.push(element);
      }
      // 文本
      function charts(text) {
        text = text.replace(/\s/g, '');
        if (text) {
          currentParent.children.push({
            type: 3,
            text: text
          });
        }
      }
      // 结束标签
      function end(tag) {
        var element = stack.pop();
        currentParent = stack[stack.length - 1];
        if (currentParent) {
          element.parent = currentParent.tag;
          currentParent.children.push(element);
        }
      }
      // 开始标签 文本 结束标签
      while (html) {
        // 判断标签 <>
        var textEnd = html.indexOf('<');
        if (textEnd === 0) {
          // 开始标签
          var startTagMatch = parseStartTag();
          if (startTagMatch) {
            start(startTagMatch.tagName, startTagMatch.attrs);
            continue;
          }
          // 结束标签
          var endTagMatch = html.match(endTag);
          if (endTagMatch) {
            advance(endTagMatch[0].length);
            end(endTagMatch[1]);
            continue;
          }
        }
        var text = void 0;
        if (textEnd > 0) {
          // 文本
          text = html.substring(0, textEnd);
          // console.log(text)
        }

        if (text) {
          advance(text.length);
          charts(text);
        }
        // break
      }

      function parseStartTag() {
        var start = html.match(startTagOpen);
        // console.log(start)
        if (!start) return;
        var match = {
          tagName: start[1],
          attrs: []
        };
        // 删除已经匹配的标签<div
        advance(start[0].length);
        // 属性匹配 注意遍历和结束>
        var attr;
        var end;
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // console.log(attr)
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          // 继续删除已经匹配的属性
          advance(attr[0].length);
        }
        if (end) {
          // console.log(end)
          advance(end[0].length);
          return match;
        }
      }
      function advance(n) {
        html = html.substring(n);
        // console.log(html)
      }
      // console.log(root)
      return root;
    }

    function compileToFunction(el) {
      // 1.html 转变成 ast语法树
      var ast = parseHTML(el);
      console.log(ast);
      // 2.ast 语法树变成 render函数(a.ast 变成字符串 b.字符串变成render函数)
      var code = generate(ast);
      // 3.将render字符串变成函数
      var render = new Function("with(this) { return ".concat(code, " }"));
      return render;
    }

    // obj = {a: 1, b: 2}
    // with(obj) {
    //     console.log(a, b)
    // }

    // 重写数组的方法
    var oldArrayProtoMethods = Array.prototype;
    var arrayMethods = Object.create(oldArrayProtoMethods); // 继承
    var methods = ['push', 'pop', 'unshift', 'shift', 'splice'];
    methods.forEach(function (item) {
      arrayMethods[item] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        // console.log('数组劫持')
        var result = oldArrayProtoMethods[item].apply(this, args);
        var inserted; // 数组追加对象的形式
        switch (item) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;
          case 'splice':
            inserted = args.splice(2);
        }
        var ob = this.__ob__; // hack
        if (inserted) {
          ob.observeArray(inserted);
        }
        ob.dep.notify(); // 通知数组更新
        return result;
      };
    });

    var id$1 = 0;
    var Dep = /*#__PURE__*/function () {
      function Dep() {
        _classCallCheck(this, Dep);
        this.id = id$1++;
        this.subs = [];
      }
      // 收集watcher
      _createClass(Dep, [{
        key: "depend",
        value: function depend() {
          // 希望watcher也可以存放dep
          // this.subs.push(Dep.target)
          Dep.target.addDep(this);
        }
      }, {
        key: "addSub",
        value: function addSub(watcher) {
          this.subs.push(watcher);
        }
        // 更新
      }, {
        key: "notify",
        value: function notify() {
          this.subs.forEach(function (watcher) {
            watcher.update();
          });
        }
      }]);
      return Dep;
    }(); // 添加watcher
    Dep.target = null;
    // 处理多个watcher computed的watcher
    var stack = [];
    function pushTarget(watcher) {
      Dep.target = watcher;
      stack.push(watcher); // 渲染watcher 其他的watcher
    }

    function popTarget() {
      // Dep.target = null
      // 解析完成一个watcher 就删除一个watcher
      stack.pop();
      Dep.target = stack[stack.length - 1]; // 获取前一个watcher
    }

    function observer(data) {
      // 判断是否是一个对象
      if (_typeof(data) != 'object' || data === null) {
        return;
      }
      // 判断用户是否已经观测
      // if (data.__ob__) {
      //     return data
      // }
      // 数据劫持
      return new Observer(data);
    }
    var Observer = /*#__PURE__*/function () {
      function Observer(data) {
        _classCallCheck(this, Observer);
        Object.defineProperty(data, '__ob__', {
          enumerable: false,
          // configurable: true,
          value: this // this表示observer对象
        });

        this.dep = new Dep(); // 给所有对象类型增加一个dep
        if (Array.isArray(data)) {
          // 处理数组
          data.__proto__ = arrayMethods;
          this.observeArray(data); // 如果是数组对象
        } else {
          // 处理对象
          this.walk(data);
        }
      }
      _createClass(Observer, [{
        key: "walk",
        value: function walk(data) {
          var keys = Object.keys(data);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = data[key];
            defineReactive(data, key, value); // 单个属性进行劫持
          }
        }
      }, {
        key: "observeArray",
        value: function observeArray(data) {
          for (var i = 0; i < data.length; i++) {
            observer(data[i]);
          }
        }
      }]);
      return Observer;
    }();
    function defineReactive(data, key, value) {
      var childDep = observer(value); // 深度监听,data存在对象的情况
      var dep = new Dep(); // 给每一个属性添加一个dep
      Object.defineProperty(data, key, {
        get: function get() {
          // 收集依赖（watcher)
          if (Dep.target) {
            dep.depend();
            if (childDep) {
              childDep.dep.depend();
            }
          }
          // console.log(dep)
          // console.log('get 获取数据')
          return value;
        },
        set: function set(newValue) {
          // console.log('set 设置数据')
          if (newValue === value) return;
          observer(newValue); // 设置的时候是对象的情况
          value = newValue;
          dep.notify();
        }
      });
    }

    /**
     * 对象：
     *  1、Object.defineProperty 缺点只能劫持对象的某一个属性
     *  2、遍历
     *  3、递归 get 和 set 是对象的时候
     * 
     * 数组：list:[1,2,3]  list:[{....}]
     *  1、函数劫持的方式
     */

    var callback = [];
    var pending$1 = false;
    function flush() {
      callback.forEach(function (cb) {
        return cb();
      });
      pending$1 = false;
    }
    var timerFunc;
    if (Promise) {
      timerFunc = function timerFunc() {
        Promise.resolve().then(flush);
      };
    } else if (MutationObserver) {
      // h5 异步方法，可以监听dom变化，监听完毕之后来异步更新
      var observe = new MutationObserver(flush);
      var textNode = document.createTextNode(1);
      observe.observe(textNode, {
        characterData: true
      }); // 检测文本内容变化
      timerFunc = function timerFunc() {
        textNode.textContent = 2;
      };
    } else if (setImmediate) {
      // ie
      timerFunc = function timerFunc() {
        setImmediate(flush);
      };
    } else {
      timerFunc = function timerFunc() {
        setTimeout(flush);
      };
    }
    function nextTick(cb) {
      // 队列[cb1, cb2]
      callback.push(cb);
      if (!pending$1) {
        timerFunc(); // 异步处理函数 需要处理兼容问题，vue3使用的是Promise.then
        pending$1 = true;
      }
    }

    var id = 0;
    var Watcher = /*#__PURE__*/function () {
      function Watcher(vm, expOrFn, cb, options) {
        _classCallCheck(this, Watcher);
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.cb = cb;
        this.options = options;
        this.id = id++;
        this.deps = [];
        this.depsId = new Set();
        this.user = !!options.user;
        // computed
        this.lazy = options.lazy; // watcher有lazy说明是computed
        this.dirty = this.lazy; // 取值的时候表示用户是否执行
        if (typeof expOrFn === 'function') {
          this.getter = expOrFn; // 用来更新视图的
        } else {
          // watch的处理
          this.getter = function () {
            // 多次监听c.c.c
            var path = expOrFn.split('.');
            var obj = vm;
            for (var i = 0; i < path.length; i++) {
              obj = obj[path[i]];
            }
            return obj;
          };
        }
        // 更新视图
        this.value = this.lazy ? void 0 : this.get(); // this.value保存watch的初始值
      }
      // 初次渲染
      _createClass(Watcher, [{
        key: "get",
        value: function get() {
          pushTarget(this); // 给dep添加watcher
          var value = this.getter.call(this.vm); // 这里会触发属性的get，就是初次的依赖收集
          popTarget(); // 给dep取消watcher
          return value;
        }
        // 更新
      }, {
        key: "update",
        value: function update() {
          // 注意：不要每次数据更新后每次调用get，get会重新渲染
          // 进行缓存
          // this.getter()
          // queueWatcher(this)
          if (this.lazy) {
            // 计算属性的watcher
            this.dirty = true;
          } else {
            // 重新渲染
            queueWatcher(this);
          }
        }
      }, {
        key: "addDep",
        value: function addDep(dep) {
          // 去重
          var id = dep.id;
          if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
          }
        }
      }, {
        key: "run",
        value: function run() {
          // this.get()
          // watch 新旧值
          var value = this.get();
          var oldValue = this.value;
          this.value = value;
          if (this.user) {
            // 执行handler 是用户的watch
            this.cb.call(this.vm, value, oldValue);
          }
        }
      }, {
        key: "evaluate",
        value: function evaluate() {
          this.value = this.get();
          this.dirty = false;
        }
        // 相互收集
      }, {
        key: "depend",
        value: function depend() {
          // 收集watcher存放到dep dep会存放到wacher中
          // 通过watcher找到对应所有的dep，在让dep都记住这个渲染watcher
          var i = this.deps.length;
          while (i--) {
            this.deps[i].depend();
          }
        }
      }]);
      return Watcher;
    }();
    var queue = []; // 用户存放批量执行的watcher的队列
    var has = {};
    var pending = false;
    function flushWatcher() {
      // queue.forEach(item => {item.run(), item.cb()})
      queue.forEach(function (item) {
        return item.run();
      });
      queue = [];
      has = {};
      pending = false;
    }
    function queueWatcher(watcher) {
      var id = watcher.id; // 每个组件都是同一个wathcer,会执行多次
      if (has[id] === undefined) {
        queue.push(watcher);
        has[id] = true;
        if (!pending) {
          // setTimeout(() => {
          //     queue.forEach(item => item.run())
          //     queue = []
          //     has = {}
          //     pending = false
          // })
          nextTick(flushWatcher); // 相当于定时器
        }

        pending = true;
      }
    }

    /**
     * 依赖收集 vue dep watcher data:{name:xx,age:xx}
     * 1、dep：dep和data中的属性是一一对应
     * 2、watcher：在视图上有几个属性，就有几个watcher
     * 3、dep与watcher: 一对多  dep.name = [w1,w2,w3,...]
     */

    /**
     * nextTick 原理
     * 1、优化
     */

    function initState(vm) {
      var opts = vm.$options;
      if (opts.data) {
        initData(vm);
      }
      if (opts.props) ;
      if (opts.computed) {
        initComputed(vm);
      }
      if (opts.watch) {
        initWatch(vm);
      }
      if (opts.methods) ;
    }

    /**
     * 初始化数据,有两种方式对象和函数
     * @param {*} vm vm
     */
    function initData(vm) {
      var data = vm.$options.data;
      data = vm._data = typeof data === 'function' ? data.call(vm) : data;
      // 代理,data中的数据设置到vm实例上
      for (var key in data) {
        proxy(vm, '_data', key);
      }
      // 数据劫持
      observer(data);
    }
    function initComputed(vm) {
      var computed = vm.$options.computed;
      // 1.需要一个watcher
      var watcher = vm._computedWatchers = {};
      // 2.将computed属性通过defineProperty进行处理
      for (var key in computed) {
        // 有两种使用方式
        var useDef = computed[key];
        var getter = typeof useDef === 'function' ? useDef : useDef.get; // watcher
        // 给没一个属性添加watcher
        watcher[key] = new Watcher(vm, getter, function () {}, {
          lazy: true
        }); // 计算属性中的watcher是赖的
        defineComputed(vm, key, useDef);
      }
    }
    var sharePropDefinition = {};
    function defineComputed(target, key, useDef) {
      sharePropDefinition = {
        enumerable: true,
        configurable: true,
        get: function get() {},
        set: function set() {}
      };
      if (typeof useDef === 'function') {
        // sharePropDefinition.get = useDef
        sharePropDefinition.get = createComputedGetter(key);
      } else {
        // sharePropDefinition.get = useDef.get
        sharePropDefinition.get = createComputedGetter(key);
        sharePropDefinition.set = useDef.set;
      }
      Object.defineProperty(target, key, sharePropDefinition);
    }
    // 高阶函数
    function createComputedGetter(key) {
      return function () {
        var watcher = this._computedWatchers[key];
        if (watcher) {
          if (watcher.dirty) {
            //执行 求值 在watcher定义一个方法
            watcher.evaluate();
          }
          // 判断是否有渲染watcher，有就执行  相互存放watcher
          if (Dep.target) {
            // 说明有渲染的watcher，收集起来
            watcher.depend();
          }
          return watcher.value;
        }
      };
    }
    function initWatch(vm) {
      // 1.获取watch
      var watch = vm.$options.watch;
      // console.log(watch)
      // 2.遍历
      var _loop = function _loop(key) {
        var handler = watch[key]; // 数组 对象 字符 函数
        if (Array.isArray(handler)) {
          handler.forEach(function (item) {
            createWatcher(vm, key, item);
          });
        } else {
          createWatcher(vm, key, handler);
        }
      };
      for (var key in watch) {
        _loop(key);
      }
    }
    function proxy(vm, source, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[source][key];
        },
        set: function set(newValue) {
          vm[source][key] = newValue;
        }
      });
    }

    // vm.$watch(() => return 'a')->第二个参数可能是个表达式，options里面user=false/true(初次渲染)
    function createWatcher(vm, expOrFn, handler, options) {
      if (_typeof(handler) === 'object') {
        options = handler;
        handler = handler.handler;
      }
      if (typeof handler === 'string') {
        handler = vm[handler];
      }
      // watch最终的处理是$watch方法
      return vm.$watch(vm, expOrFn, handler, options);
    }
    function stateMixin(Vue) {
      // 列队：1.vue自己nextTick  2.用户自定的
      Vue.prototype.$nextTick = function (cb) {
        nextTick(cb);
      };
      Vue.prototype.$watch = function (vm, expOrFn, handler) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        // console.log(vm)
        // 实现watch方法就是new Watcher
        // 渲染走渲染的watcher,$watch走watcher user=false
        new Watcher(vm, expOrFn, handler, _objectSpread2(_objectSpread2({}, options), {}, {
          user: true
        }));
        if (options.immediate) {
          handler.call(vm);
        }
      };
    }

    function patch(oldVnode, vnode) {
      // console.log(oldNode, vnode)
      // 第一次渲染 oldNode 是一个真实的dom
      // 如果是组件
      if (!oldVnode) {
        return createEl(vnode);
      }
      if (oldVnode.nodeType === 1) {
        // 1.创建新的dom
        var el = createEl(vnode);
        // console.log(el)
        // 2.替换 (1)-获取父节点 (2)-插入 (3)-删除
        var parentEl = oldVnode.parentNode;
        parentEl.insertBefore(el, oldVnode.nextsibling);
        parentEl.removeChild(oldVnode);
        return el;
      } else {
        // diff算法
        // console.log(oldVnode, vnode)
        // 1.标签是不一样的，直接用新的替换老的
        if (oldVnode.tag !== vnode.tag) {
          return oldVnode.el.parentNode.replaceChild(createEl(vnode), oldVnode.el);
        }
        // 2.标签一样 text和属性不一样
        if (!oldVnode.tag) {
          // 是文本 <div>1</div> <div>2</div> tag: undefined
          if (oldVnode.text !== vnode.text) {
            // 文本不一样直接替换
            return oldVnode.el.textContent = vnode.text;
          }
        }
        // 2.1 属性处理 <div id="a"></div> <div id="a"></div>
        // 方法1 直接复制
        var _el = vnode.el = oldVnode.el;
        updateProps(vnode, oldVnode.data);
        // 3.子元素diff(核心)
        // 3.1 老的有儿子，新的没有儿子
        // 3.2 老的没有儿子，新的有儿子
        // 3.3 老的有儿子，新的有儿子（核心）
        var oldChildren = oldVnode.children || [];
        var newChildren = vnode.children || [];
        if (oldChildren.length > 0 && newChildren.length > 0) {
          updateChild(oldChildren, newChildren, _el);
        } else if (oldChildren.length > 0) {
          _el.innerHTML = '';
        } else if (newChildren.length > 0) {
          for (var i = 0; i < newChildren.length; i++) {
            var child = newChildren[i];
            // 添加到真实dom
            _el.appendChild(createEl(child));
          }
        }
      }
    }

    // 添加属性
    function updateProps(vnode) {
      var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var newProps = vnode.data || {};
      var el = vnode.el; // 更新的时候已经替换为老的dom节点
      // 1.老的有属性，新的没有
      for (var key in oldProps) {
        if (!newProps[key]) {
          el.removeAttribute[key];
        }
      }
      // 2.样式 老的style={color: red} 新的style={background: red}
      var newStyle = newProps.style || {};
      var oldStyle = oldProps.style || {};
      for (var _key in oldStyle) {
        if (!newStyle[_key]) {
          el.style = '';
        }
      }
      // 新的
      for (var _key2 in newProps) {
        if (_key2 === 'style') {
          for (var styleName in newProps.style) {
            el.style[styleName] = newProps.style[styleName];
          }
        } else if (_key2 === 'class') {
          el.className = newProps["class"];
        } else {
          el.setAttribute(_key2, newProps[_key2]);
        }
      }
    }
    function createEl(vnode) {
      vnode.vm;
        var tag = vnode.tag,
        children = vnode.children;
        vnode.data;
        vnode.key;
        var text = vnode.text;
      // console.log(vnode)
      if (typeof tag === 'string') {
        if (createComponent$1(vnode)) {
          return vnode.componentInstance.$el;
        } else {
          vnode.el = document.createElement(tag);
          updateProps(vnode);
          if (children && children.length > 0) {
            children && children.forEach(function (child) {
              vnode.el.appendChild(createEl(child));
            });
          }
        }
      } else {
        vnode.el = document.createTextNode(text);
      }
      return vnode.el;
    }
    function createComponent$1(vnode) {
      var i = vnode.data;
      if ((i = i.hook) && (i = i.init)) {
        i(vnode);
      }
      if (vnode.componentInstance) {
        return true;
      }
      return false;
    }
    function updateChild(oldChildren, newChildren, parent) {
      // vue diff 算法做了很多优化
      // dom 中操作元素常用的逻辑：尾部添加 头部添加 正序和倒序的方式
      // vue2 采用双指针的方式
      // 1.创建双指针
      var oldStartIndex = 0;
      var oldStartVnode = oldChildren[oldStartIndex];
      var oldEndIndex = oldChildren.length - 1;
      var oldEndVnode = oldChildren[oldEndIndex];
      var newStartIndex = 0;
      var newStartVnode = newChildren[newStartIndex];
      var newEndIndex = newChildren.length - 1;
      var newEndVnode = newChildren[newEndIndex];
      var forward = 'head';
      function isSameVnode(oldVnode, newVnode) {
        return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
      }
      // 创建映射表
      function makeIndexByKey(child) {
        var keyMap = {};
        child.forEach(function (item, index) {
          if (item.key) {
            keyMap[item.key] = index;
          }
        });
        return keyMap;
      }
      var map = makeIndexByKey(oldChildren);
      // 2.遍历
      while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        // 对比子元素
        // 头部先进行对比（注意是否是同一个元素）
        if (isSameVnode(oldStartVnode, newStartVnode)) {
          // 头部进行对比
          // 递归
          patch(oldStartVnode, newStartVnode);
          // 移动指针
          oldStartVnode = oldChildren[++oldStartIndex];
          newStartVnode = newChildren[++newStartIndex];
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
          // 尾部进行对比
          forward = 'end';
          patch(oldEndVnode, newEndVnode);
          oldEndVnode = oldChildren[--oldEndIndex];
          newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
          // 倒序
          patch(oldStartVnode, newEndVnode);
          parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
          oldStartVnode = oldChildren[++oldStartIndex];
          newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
          // 倒序
          patch(oldEndVnode, newStartVnode);
          parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
          oldEndVnode = oldChildren[--oldEndIndex];
          newStartVnode = newChildren[++newStartIndex];
        } else {
          // 暴力比对
          // 1.创建旧元素的映射表
          // 2.新的从老的节点中寻找元素
          var moveIndex = map[newStartVnode.key];
          if (moveIndex === undefined) {
            // 没有找到
            parent.insertBefore(createEl(newStartVnode), oldStartVnode.el);
          } else {
            // 获取到旧的元素插入到第一个元素前面即复用
            var moveVnode = oldChildren[moveIndex]; // 获取到节点
            oldChildren[moveIndex] = null; // 防止数组塌陷
            parent.insertBefore(moveVnode.el, oldStartVnode.el); // 插入
            patch(moveVnode, newStartVnode); // 递归 可能有儿子
          }

          newStartVnode = newChildren[++newStartIndex];
        }
      }
      // 添加新的多余的元素
      if (newStartIndex <= newEndIndex) {
        if (forward === 'head') {
          for (var i = newStartIndex; i <= newEndIndex; i++) {
            parent.appendChild(createEl(newChildren[i]));
          }
        }
        if (forward === 'end') {
          for (var _i = newEndIndex; _i >= newStartIndex; _i--) {
            parent.insertBefore(createEl(newChildren[_i]), parent.children[0]);
          }
        }
      }
      // 将老的中多余的元素删除
      if (oldStartIndex <= oldEndIndex) {
        for (var _i2 = oldStartIndex; _i2 <= oldEndIndex; _i2++) {
          var child = oldChildren[_i2];
          if (child != null) {
            parent.removeChild(child.el);
          }
        }
      }
    }

    /**
     * vue渲染流程
     *  1、数据初始化
     *  2、对模板进行编译
     *  3、ast变成render字符串和函数
     *  4、通过render函数变成vnode
     *  5、vnode变成真实dom
     *  6、放到页面
     */

    function mountedComponent(vm, el) {
      callHook(vm, 'beforeMounted');
      //  1.vm._render将render函数变vnode 2.vm._update vnode变成真实dom
      // vm._update(vm._render())
      var updateComponent = function updateComponent() {
        vm._update(vm._render());
      };
      new Watcher(vm, updateComponent, function () {
        callHook(vm, 'updated');
      }, true);
      callHook(vm, 'mounted');
    }
    function lifecycleMixin(Vue) {
      // vnode -> 真实dom
      Vue.prototype._update = function (vnode) {
        // console.log(vnode)
        var vm = this;
        // vm.$el = patch(vm.$el, vnode)
        // 需要区分是首次还是更新
        var prevVnode = vm._vnode;
        if (!prevVnode) {
          vm.$el = patch(vm.$el, vnode);
          vm._vnode = vnode;
        } else {
          patch(prevVnode, vnode);
        }
      };
    }

    // 生命周期调用
    function callHook(vm, hook) {
      var handlers = vm.$options[hook];
      if (handlers) {
        for (var i = 0; i < handlers.length; i++) {
          handlers[i].call(this);
        }
      }
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        // console.log(options)
        var vm = this;
        // vm.$options = options
        // vm.$options = mergeOptions(Vue.options, options)
        // 组件
        vm.$options = mergeOptions(this.constructor.options, options);
        console.log(vm.$options);
        callHook(vm, 'beforeCreated');
        // 初始化状态
        initState(vm);
        callHook(vm, 'created');
        // 编译模板
        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      };
      Vue.prototype.$mount = function (el) {
        var vm = this;
        el = document.querySelector(el);
        vm.$el = el;
        var options = vm.$options;
        if (!options.render) {
          var template = options.template;
          if (!template && el) {
            el = el.outerHTML;
            // console.log(el)
            // render函数
            var render = compileToFunction(el);
            console.log(render);
            // 1.将render函数变vnode 2.vnode变成真实dom
            options.render = render;
          } else {
            // console.log(template)
            var _render = compileToFunction(template);
            console.log(_render);
            // 1.将render函数变vnode 2.vnode变成真实dom
            options.render = _render;
          }
        }
        mountedComponent(vm); // render函数变成真实dom挂载到页面
      };
    }

    function renderMixin(Vue) {
      Vue.prototype._c = function () {
        // 标签
        return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
      };
      Vue.prototype._v = function (text) {
        // 文本
        return createText(text);
      };
      Vue.prototype._s = function (val) {
        // 插值表达式
        return val === null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
      };
      Vue.prototype._render = function () {
        var vm = this;
        var render = vm.$options.render;
        var vnode = render.call(this);
        // console.log(vnode)
        return vnode;
      };
    }
    function createElement(vm, tag) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        children[_key - 3] = arguments[_key];
      }
      // 需要判断是否是组件
      if (isReservedTag(tag)) {
        // 是标签
        return vnode(vm, tag, data, data.key, children, undefined);
      } else {
        // 组件
        var Ctor = vm.$options['components'][tag];
        return createComponent(vm, tag, data, children, Ctor);
      }
    }

    // 创建组件的虚拟节点
    function createComponent(vm, tag, data, children, Ctor) {
      if (_typeof(Ctor) == 'object') {
        Ctor = vm.constructor.extend(Ctor);
      }
      data.hook = {
        init: function init(vnode) {
          var child = vnode.componentInstance = new vnode.componentOptions.Ctor({});
          child.$mount();
        }
      };
      return vnode('vm', 'vue-component-' + tag, data, undefined, undefined, undefined, {
        Ctor: Ctor,
        children: children
      });
    }
    function isReservedTag(tag) {
      return ['a', 'div', 'h', 'button', 'span', 'input', 'li', 'ul', 'h1', 'h2'].includes(tag);
    }
    function createText(text) {
      return vnode(undefined, undefined, undefined, undefined, undefined, text, undefined);
    }
    function vnode(vm, tag, data, key, children, text, componentOptions) {
      return {
        vm: vm,
        tag: tag,
        data: data,
        key: key,
        children: children,
        text: text,
        componentOptions: componentOptions
      };
    }

    function Vue(options) {
      // 初始化
      this._init(options);
    }
    initMixin(Vue);
    lifecycleMixin(Vue);
    renderMixin(Vue);
    stateMixin(Vue); // 给vm添加$nextTick

    // 全局的方法 Vue.minin,Vue.component,Vue.extend
    initGlobalApi(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
