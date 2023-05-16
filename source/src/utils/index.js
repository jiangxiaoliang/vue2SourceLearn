export const HOOKS = [
    'beforeCreated',
    'created',
    'beforeMounted',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]

// 策略模式
let starts = {}
starts.data = function(parentVal, childVal) {
    return childVal
}
// starts.computed = function() {}
// starts.watch = function() {}
// starts.methods = function() {}
starts.components = function(parentVal, childVal) {
    const obj = Object.create(parentVal)
    if (childVal) {
        for (let key in childVal) {
            obj[key] = childVal[key]
        }
    }
    return obj
}
HOOKS.forEach(hook => {
    starts[hook] = mergeHook
})

function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal)
        } else {
            return [childVal]
        }
    } else {
        return parentVal
    }
}

export function mergeOptions(parent, child) {
    // console.log(parent, child)
    // Vue.options={created:[a,b,c], data:[a,b,c]}
    let options = {}
    for (let key in parent) {
        mergeField(key)
    }
    for (let key in child) {
        mergeField(key)
    }
    function mergeField(key) {
        // 策略模式
        if (starts[key]) {
            options[key] = starts[key](parent[key], child[key])
        } else {
            options[key] = child[key] || parent[key]
        }
    }
    return options
}