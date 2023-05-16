import Watcher from "./observer/watcher"
import { patch } from "./vnode/patch"

export function mountedComponent(vm, el) {
    callHook(vm, 'beforeMounted')
    //  1.vm._render将render函数变vnode 2.vm._update vnode变成真实dom
    // vm._update(vm._render())
    let updateComponent = () => {
        vm._update(vm._render())
    }
    new Watcher(vm, updateComponent, () => {
        callHook(vm, 'updated')
    }, true)
    callHook(vm, 'mounted')
}

export function lifecycleMixin(Vue) {
    // vnode -> 真实dom
    Vue.prototype._update = function(vnode) {
        // console.log(vnode)
        let vm = this
        // vm.$el = patch(vm.$el, vnode)
        // 需要区分是首次还是更新
        let prevVnode = vm._vnode
        if (!prevVnode) {
            vm.$el = patch(vm.$el, vnode)
            vm._vnode = vnode
        } else {
            patch(prevVnode, vnode)
        }
    }
}

// 生命周期调用
export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(this)
        }
    }
}