// 1、通过这个类实现watcher更新

import { nextTick } from "../utils/nextTick"
import { popTarget, pushTarget } from "./dep"

let id = 0
class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.options = options
        this.id = id++
        this.deps = []
        this.depsId = new Set()
        this.user = !!options.user
        // computed
        this.lazy = options.lazy // watcher有lazy说明是computed
        this.dirty = this.lazy // 取值的时候表示用户是否执行
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn // 用来更新视图的
        } else { // watch的处理
            this.getter = function() { // 多次监听c.c.c
                let path = expOrFn.split('.')
                let obj = vm
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj
            }
        }
        // 更新视图
        this.value = this.lazy ? void 0 : this.get() // this.value保存watch的初始值
    }
    // 初次渲染
    get() {
        pushTarget(this) // 给dep添加watcher
        const value = this.getter.call(this.vm) // 这里会触发属性的get，就是初次的依赖收集
        popTarget() // 给dep取消watcher
        return value
    }
    // 更新
    update() {
        // 注意：不要每次数据更新后每次调用get，get会重新渲染
        // 进行缓存
        // this.getter()
        // queueWatcher(this)
        if (this.lazy) { // 计算属性的watcher
            this.dirty = true
        } else { // 重新渲染
            queueWatcher(this)
        }
    }
    addDep(dep) {
        // 去重
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }
    run() {
        // this.get()
        // watch 新旧值
        let value = this.get()
        let oldValue = this.value
        this.value = value
        if (this.user) { // 执行handler 是用户的watch
            this.cb.call(this.vm, value, oldValue)
        }
    }
    evaluate() {
        this.value = this.get()
        this.dirty = false
    }
    // 相互收集
    depend() {
        // 收集watcher存放到dep dep会存放到wacher中
        // 通过watcher找到对应所有的dep，在让dep都记住这个渲染watcher
        let i = this.deps.length
        while(i--) {
            this.deps[i].depend()
        }
    }
}

let queue = [] // 用户存放批量执行的watcher的队列
let has = {}
let pending = false
function flushWatcher() {
    // queue.forEach(item => {item.run(), item.cb()})
    queue.forEach(item => item.run())
    queue = []
    has = {}
    pending = false
}
function queueWatcher(watcher) {
    let id = watcher.id // 每个组件都是同一个wathcer,会执行多次
    if (has[id] === undefined) {
        queue.push(watcher)
        has[id] = true
        if (!pending) {
            // setTimeout(() => {
            //     queue.forEach(item => item.run())
            //     queue = []
            //     has = {}
            //     pending = false
            // })
            nextTick(flushWatcher) // 相当于定时器
        }
        pending = true
    }
}

export default Watcher

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