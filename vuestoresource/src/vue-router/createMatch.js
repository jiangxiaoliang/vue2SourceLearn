import { createRoute, createRouterMap } from "./createRouterMap";

export function createMatch(routes) {
    // 1.变成一个路由映射表 [{}, {}] => {'/': {...}, '/about': {....}, '/about/a': {...}}
    const { pathMap } = createRouterMap(routes)
    // 2.动态添加路由addRoutes 需要和pathMap合并
    function addRoutes(userRoutes) {
        createRouterMap(userRoutes, pathMap)
    }
    // addRoutes([{
    //     path: '/about',
    //     component: 'xx',
    //     children: [{
    //         path: '/c',
    //         component: 'xxc'
    //     }]
    // }])
    console.log(pathMap)
    // 3.路径要返回一个数组 /about/a 对应 router-view router-view /about/a:[{...}, {....}]
    function match(location) {
        let record = pathMap[location]
        if (record) {
            return createRoute(record, { path: location })
        }
        return createRoute(null, { path: location })
    }

    // console.log(match('/about/a'))

    return {
        addRoutes,
        match
    }
}