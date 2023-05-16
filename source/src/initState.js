import { observer } from "./observer/index"
import { nextTick } from "./utils/nextTick"
import Watcher from './observer/watcher'
import Dep from './observer/dep'

export function initState(vm) {
	let opts = vm.$options
	if (opts.data) {
		initData(vm)
	}
	if (opts.props) {
		initProps()
	}
	if (opts.computed) {
		initComputed(vm)
	}
	if (opts.watch) {
		initWatch(vm)
	}
	if (opts.methods) {
		initMethods()
	}
}

/**
 * 初始化数据,有两种方式对象和函数
 * @param {*} vm vm
 */
function initData(vm) {
	let data = vm.$options.data
	data = vm._data = typeof data === 'function' ? data.call(vm) : data
	// 代理,data中的数据设置到vm实例上
	for (let key in data) {
		proxy(vm, '_data', key)
	}
	// 数据劫持
	observer(data)
}

function initProps() {}

function initComputed(vm) {
	let computed = vm.$options.computed
	// 1.需要一个watcher
	let watcher = vm._computedWatchers = {}
	// 2.将computed属性通过defineProperty进行处理
	for (let key in computed) {
		// 有两种使用方式
		let useDef = computed[key]
		let getter = typeof useDef === 'function' ? useDef : useDef.get // watcher
		// 给没一个属性添加watcher
		watcher[key] = new Watcher(vm, getter, () => {}, {
			lazy: true
		}) // 计算属性中的watcher是赖的
		defineComputed(vm, key, useDef)
	}
}

let sharePropDefinition = {}

function defineComputed(target, key, useDef) {
	sharePropDefinition = {
		enumerable: true,
		configurable: true,
		get: () => {},
		set: () => {}
	}
	if (typeof useDef === 'function') {
		// sharePropDefinition.get = useDef
		sharePropDefinition.get = createComputedGetter(key)
	} else {
		// sharePropDefinition.get = useDef.get
		sharePropDefinition.get = createComputedGetter(key)
		sharePropDefinition.set = useDef.set
	}
	Object.defineProperty(target, key, sharePropDefinition)
}
// 高阶函数
function createComputedGetter(key) {
	return function () {
		let watcher = this._computedWatchers[key]
		if (watcher) {
			if (watcher.dirty) {
				//执行 求值 在watcher定义一个方法
				watcher.evaluate()
			}
			// 判断是否有渲染watcher，有就执行  相互存放watcher
			if (Dep.target) { // 说明有渲染的watcher，收集起来
				watcher.depend()
			}
			return watcher.value
		}
	}
}

function initWatch(vm) {
	// 1.获取watch
	let watch = vm.$options.watch
	// console.log(watch)
	// 2.遍历
	for (let key in watch) {
		let handler = watch[key] // 数组 对象 字符 函数
		if (Array.isArray(handler)) {
			handler.forEach(item => {
				createWatcher(vm, key, item)
			})
		} else {
			createWatcher(vm, key, handler)
		}
	}
}

function initMethods() {}

function proxy(vm, source, key) {
	Object.defineProperty(vm, key, {
		get() {
			return vm[source][key]
		},
		set(newValue) {
			vm[source][key] = newValue
		}
	})
}

// vm.$watch(() => return 'a')->第二个参数可能是个表达式，options里面user=false/true(初次渲染)
function createWatcher(vm, expOrFn, handler, options) {
	if (typeof handler === 'object') {
		options = handler
		handler = handler.handler
	}
	if (typeof handler === 'string') {
		handler = vm[handler]
	}
	// watch最终的处理是$watch方法
	return vm.$watch(vm, expOrFn, handler, options)
}

export function stateMixin(Vue) {
	// 列队：1.vue自己nextTick  2.用户自定的
	Vue.prototype.$nextTick = function (cb) {
		nextTick(cb)
	}
	Vue.prototype.$watch = function (vm, expOrFn, handler, options = {}) {
		// console.log(vm)
		// 实现watch方法就是new Watcher
		// 渲染走渲染的watcher,$watch走watcher user=false
		let watcher = new Watcher(vm, expOrFn, handler, {
			...options,
			user: true
		})
		if (options.immediate) {
			handler.call(vm)
		}
	}
}