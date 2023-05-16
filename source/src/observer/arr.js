// 重写数组的方法
let oldArrayProtoMethods= Array.prototype
export let arrayMethods = Object.create(oldArrayProtoMethods) // 继承
let methods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice'
]

methods.forEach(item => {
    arrayMethods[item] = function(...args) {
        // console.log('数组劫持')
        let result = oldArrayProtoMethods[item].apply(this, args)
        let inserted // 数组追加对象的形式
        switch (item) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                inserted = args.splice(2) // splice第三个参数是插入的数据
            default:
                break;
        }
        let ob = this.__ob__ // hack
        if (inserted) {
            ob.observeArray(inserted)
        }
        ob.dep.notify() // 通知数组更新
        return result
    }
})