export function renderMixin(Vue) {
    Vue.prototype._c = function() { // 标签
        return createElement(this, ...arguments)
    }
    Vue.prototype._v = function(text) { // 文本
        return createText(text)
    }
    Vue.prototype._s = function(val) { // 插值表达式
        return val === null ? '' : ((typeof val === 'object') ? JSON.stringify(val) : val)
    }
    Vue.prototype._render = function() {
        let vm = this
        let render = vm.$options.render
        let vnode = render.call(this)
        // console.log(vnode)
        return vnode
    }
}

function createElement(vm, tag, data={}, ...children) {
    // 需要判断是否是组件
    if (isReservedTag(tag)) { // 是标签
        return vnode(vm, tag, data, data.key, children, undefined)
    } else { // 组件
        const Ctor = vm.$options['components'][tag]
        return createComponent(vm, tag, data, children, Ctor)
    }
}

// 创建组件的虚拟节点
function createComponent(vm, tag, data, children, Ctor) {
    if (typeof Ctor == 'object') {
        Ctor = vm.constructor.extend(Ctor)
    }
    data.hook = {
        init(vnode) {
            let child = vnode.componentInstance = new vnode.componentOptions.Ctor({})
            child.$mount()
        }
    }
    return vnode('vm', 'vue-component-' + tag, data, undefined, undefined, undefined, { Ctor, children })
}

function isReservedTag(tag) {
    return ['a', 'div', 'h', 'button', 'span', 'input', 'li', 'ul', 'h1', 'h2'].includes(tag)
}

function createText(text) {
    return vnode(undefined, undefined, undefined, undefined, undefined, text, undefined)
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
    return {
        vm,
        tag,
        data,
        key,
        children,
        text,
        componentOptions
    }
}