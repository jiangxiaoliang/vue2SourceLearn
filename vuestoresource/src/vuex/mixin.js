export let Vue
// 实现 store 放到每一个组件中
export const install = function (_Vue) {
    // console.log('install')
    Vue = _Vue
    Vue.mixin({
        beforeCreate() {
            // console.log(this.$options.name)
            let options = this.$options
            if (options.store) { // 根实例
                this.$store = options.store
            } else {
                this.$store = this.$parent && this.$parent.$store
            }
        }
    })
}