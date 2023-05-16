import { compileToFunction } from "./compile/index"
import { initState } from "./initState"
import { callHook, mountedComponent } from "./lifecycle"
import { mergeOptions } from "./utils/index"

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        // console.log(options)
        let vm = this
        // vm.$options = options
        // vm.$options = mergeOptions(Vue.options, options)
        // 组件
        vm.$options = mergeOptions(this.constructor.options, options)
        console.log(vm.$options)
        callHook(vm, 'beforeCreated')
        // 初始化状态
        initState(vm)
        callHook(vm, 'created')
        // 编译模板
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function(el) {
        let vm = this
        el = document.querySelector(el)
        vm.$el = el
        let options = vm.$options
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                el = el.outerHTML
                // console.log(el)
                // render函数
                let render = compileToFunction(el)
                console.log(render)
                // 1.将render函数变vnode 2.vnode变成真实dom
                options.render = render
            } else {
                // console.log(template)
                let render = compileToFunction(template)
                console.log(render)
                // 1.将render函数变vnode 2.vnode变成真实dom
                options.render = render
            }
        }
        mountedComponent(vm, el) // render函数变成真实dom挂载到页面
    }
}