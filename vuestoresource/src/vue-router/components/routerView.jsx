export default {
    functional: true,

    render(h, context) {
        console.log(context)
        let { parent, data } = context
        let route = parent.$route
        console.log(route)
        data.routerView = true
        let depath = 0
        while (parent) {
            if (parent.$vnode && parent.$vnode.data.routerView) {
                depath++
            }
            parent = parent.$parent
        }
        console.log(depath, 5555)
        let record = route.matched[0].matched[depath]
        console.log(record)
        if (!record) {
            return h()
        }
        return h(record.component, data)
    }
}