export function createRouterMap(routes, routeOption = {}) {
    // console.log(routes)
    let pathMap = routeOption
    routes.forEach(route => {
        addRouterRecord(route, pathMap)
    })
    // console.log(pathMap)
    return { pathMap }
}

function addRouterRecord(route, pathMap, parent) {
    let path = parent ? `${parent.path}/${route.path}` : route.path
    let record = {
        path: route.path,
        name: route.name,
        component: route.component,
        parent
    }
    if (!pathMap[path]) {
        pathMap[path] = record
    }
    if (route.children) {
        // 注意parent
        route.children.forEach(child => {
            addRouterRecord(child, pathMap, record)
        })
    }
}

export function createRoute(record, { path }) {
    let matched = []
    if (record) {
        while (record) {
            matched.unshift(record)
            record = record.parent
        }
    }
    return {
        path,
        matched
    }
}