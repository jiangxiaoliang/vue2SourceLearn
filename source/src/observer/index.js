import { arrayMethods } from './arr'
import Dep from './dep'

export function observer(data) {
    // 判断是否是一个对象
    if (typeof data != 'object' || data === null) {
        return
    }
    // 判断用户是否已经观测
    // if (data.__ob__) {
    //     return data
    // }
    // 数据劫持
    return new Observer(data)
}

class Observer {
    constructor(data) {
        Object.defineProperty(data, '__ob__', {
            enumerable: false,
            // configurable: true,
            value: this // this表示observer对象
        })
        this.dep = new Dep() // 给所有对象类型增加一个dep
        if (Array.isArray(data)) { // 处理数组
            data.__proto__ = arrayMethods
            this.observeArray(data) // 如果是数组对象
        } else { // 处理对象
            this.walk(data)
        }
    }
    walk(data) {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let value = data[key]
            defineReactive(data, key, value) // 单个属性进行劫持
        }
    }
    observeArray(data) {
        for(let i = 0; i < data.length; i++) {
            observer(data[i])
        }
    }
}

function defineReactive(data, key, value) {
    let childDep = observer(value) // 深度监听,data存在对象的情况
    let dep = new Dep() // 给每一个属性添加一个dep
    Object.defineProperty(data, key, {
        get() { // 收集依赖（watcher)
            if (Dep.target) {
                dep.depend()
                if (childDep) {
                    childDep.dep.depend()
                }
            }
            // console.log(dep)
            // console.log('get 获取数据')
            return value
        },
        set(newValue) {
            // console.log('set 设置数据')
            if (newValue === value) return
            observer(newValue) // 设置的时候是对象的情况
            value = newValue
            dep.notify()
        }
    })
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