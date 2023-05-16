let id = 0
class Dep {
    constructor() {
        this.id = id++
        this.subs = []
    }
    // 收集watcher
    depend() {
        // 希望watcher也可以存放dep
        // this.subs.push(Dep.target)
        Dep.target.addDep(this)
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
    // 更新
    notify() {
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}

// 添加watcher
Dep.target = null
// 处理多个watcher computed的watcher
let stack = []
export function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(watcher) // 渲染watcher 其他的watcher
}
export function popTarget() {
    // Dep.target = null
    // 解析完成一个watcher 就删除一个watcher
    stack.pop()
    Dep.target = stack[stack.length - 1] // 获取前一个watcher
}

export default Dep