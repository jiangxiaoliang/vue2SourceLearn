import { createRoute } from "../createRouterMap"

function runQueue(queue, iterator, cb) {
    // 异步执行
    function step(index) {
        if (index >= queue.length) return cb()
        let hook = queue[index]
        iterator(hook, () => step(index + 1))
    }
    step(0)
}

class History {
    constructor(router) {
        this.router = router
        this.current = createRoute(null, { path: '/' })
    }

    transitionTo(curLocation, cb) {
        // console.log(curLocation)
        // 根据获取的最新路由 渲染组件
        let router = this.router.matcher.match(curLocation)
        console.log(router)
        // 路由改变视图要改变 响应式
        this.current = createRoute(router, { path: curLocation })
        let queue = [].concat(this.router.beforeHook)
        const iterator = (hook, next) => {
            hook(this.current, router, () => {
                next()
            })
        }
        // console.log(this.cb, cb)
        runQueue(queue, iterator, () => {
            this.cb && this.cb(this.current)
            cb && cb()
        })
        // this.cb && this.cb(this.current) // 路由变化是响应式
        // cb && cb() // 监听路有变化
    }

    push(to) {
        this.transitionTo(to, () => {
            window.location.hash = to
        })
    }

    listen(cb) {
        this.cb = cb
    }
}

export {
    History
}