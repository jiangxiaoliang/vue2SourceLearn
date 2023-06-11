import routerLink from "./components/routerLink"
import routerView from "./components/routerView"
import { createMatch } from "./createMatch"
import { HashHistory } from "./history/hash"
import { HtmlHistory } from "./history/html5"

let Vue
export default class VueRouter {
    constructor(options = {}) {
        // 核心1 match [{}, {}] => {'/': {...}, '/about': {....}}
        this.matcher = createMatch(options.routes || [])
        // 核心2 浏览器路由管理 history hash
        options.mode = options.mode || 'hash'
        this.beforeHook = []
        switch (options.mode) {
            case 'hash':
                this.history = new HashHistory(this)
                break
            case 'history':
                this.history = new HtmlHistory(this)
                break
        }
    }

    push(location) {
        // this.history.transitionTo(location)
        this.history.push(location)
    }

    beforeEach(fn) {
        this.beforeHook.push(fn) // 有多个要列队执行
    }

    /**
     * 根据路由找到组件
     * @param {*} app 组件实例 
     */
    init(app) {
        const history = this.history

        history.listen((route) => {
            app._route = route
        })

        const setupHashListener = () => {
            history.setupListener() // 监听路由变化
        }
        history.transitionTo(
            history.getCurrentLocation(),
            setupHashListener
        )
    }
}

VueRouter.install = (_Vue) => {
    Vue = _Vue
    // console.log(_Vue)

    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) {
                this._routerRoot = this
                this._router = this.$options.router
                this._router.init(this)
                // 响应式
                Vue.util.defineReactive(this, '_route', this._router.history.current)
            } else {
                // this._router = this.$parent && this.$parent._router
                this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
            }
        }
    })

    // 代理$route属性和$router方法
    Object.defineProperty(Vue.prototype, '$router', {
        get() {
            return this._routerRoot._router
        }
    })
    Object.defineProperty(Vue.prototype, '$route', {
        get() {
            return this._routerRoot._route
        }
    })

    Vue.component('router-link', routerLink)
    Vue.component('router-view', routerView)
}