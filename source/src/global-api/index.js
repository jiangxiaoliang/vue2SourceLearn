import { mergeOptions } from "../utils/index"

export function initGlobalApi(Vue) {
    Vue.options = {}
    Vue.mixin = function(mixinOptions) {
        // 对象的合并
        this.options = mergeOptions(this.options, mixinOptions)
        // console.log(this.options, 99)
    }
    // 组件
    Vue.options.components = {} // 放全局组件
    Vue.component = function(id, componentDef) {
        componentDef.name = componentDef.name || id
        componentDef = this.extend(componentDef) // 返回一个实例
        this.options.components[id] = componentDef
    }
    // 核心 创建一个子类
    Vue.extend = function(options) {
        const Super = this
        const Sub = function vueComponent(opts) {
            // new Sub().$mount()
            // 初始化
            this._init(opts)
        }
        // 子组件继承父组件中的属性
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        // 将负组件中的属性合并到子组件中
        Sub.options = mergeOptions(Super.options, options)
        console.log(this.options)
        return Sub
    }
}