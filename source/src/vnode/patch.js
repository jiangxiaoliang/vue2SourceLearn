export function patch(oldVnode, vnode) {
    // console.log(oldNode, vnode)
    // 第一次渲染 oldNode 是一个真实的dom
    // 如果是组件
    if (!oldVnode) {
        return createEl(vnode)
    }
    if (oldVnode.nodeType === 1) {
        // 1.创建新的dom
        let el = createEl(vnode)
        // console.log(el)
        // 2.替换 (1)-获取父节点 (2)-插入 (3)-删除
        let parentEl = oldVnode.parentNode
        parentEl.insertBefore(el, oldVnode.nextsibling)
        parentEl.removeChild(oldVnode)
        return el
    } else { // diff算法
        // console.log(oldVnode, vnode)
        // 1.标签是不一样的，直接用新的替换老的
        if (oldVnode.tag !== vnode.tag) {
            return oldVnode.el.parentNode.replaceChild(createEl(vnode), oldVnode.el)
        }
        // 2.标签一样 text和属性不一样
        if (!oldVnode.tag) { // 是文本 <div>1</div> <div>2</div> tag: undefined
            if (oldVnode.text !== vnode.text) { // 文本不一样直接替换
                return oldVnode.el.textContent = vnode.text
            }
        }
        // 2.1 属性处理 <div id="a"></div> <div id="a"></div>
        // 方法1 直接复制
        let el = vnode.el = oldVnode.el
        updateProps(vnode, oldVnode.data)
        // 3.子元素diff(核心)
        // 3.1 老的有儿子，新的没有儿子
        // 3.2 老的没有儿子，新的有儿子
        // 3.3 老的有儿子，新的有儿子（核心）
        let oldChildren = oldVnode.children || []
        let newChildren = vnode.children || []
        if (oldChildren.length > 0 && newChildren.length > 0) {
            updateChild(oldChildren, newChildren, el)
        } else if (oldChildren.length > 0) {
            el.innerHTML = ''
        } else if (newChildren.length > 0) {
            for (let i = 0; i < newChildren.length; i++) {
                let child = newChildren[i]
                // 添加到真实dom
                el.appendChild(createEl(child))
            }
        }
     }
}

// 添加属性
function updateProps(vnode, oldProps={}) {
    let newProps = vnode.data || {}
    let el = vnode.el // 更新的时候已经替换为老的dom节点
    // 1.老的有属性，新的没有
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute[key]
        }
    }
    // 2.样式 老的style={color: red} 新的style={background: red}
    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style = ''
        }
    }
    // 新的
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
        
    }
}

export function createEl(vnode) {
    let { vm, tag, children, data, key, text } = vnode
    // console.log(vnode)
    if (typeof tag === 'string') {
        if (createComponent(vnode)) {
            return vnode.componentInstance.$el
        } else {
            vnode.el = document.createElement(tag)
            updateProps(vnode)
            if (children && children.length > 0) {
                children && children.forEach(child => {
                    vnode.el.appendChild(createEl(child))
                })
            }
        }
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function createComponent(vnode) {
    let i = vnode.data
    if ((i = i.hook) && (i = i.init)) {
        i(vnode)
    }
    if (vnode.componentInstance) {
        return true
    }
    return false
}

function updateChild(oldChildren, newChildren, parent) {
    // vue diff 算法做了很多优化
    // dom 中操作元素常用的逻辑：尾部添加 头部添加 正序和倒序的方式
    // vue2 采用双指针的方式
    // 1.创建双指针
    let oldStartIndex = 0
    let oldStartVnode = oldChildren[oldStartIndex]
    let oldEndIndex = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldEndIndex]
    let newStartIndex = 0
    let newStartVnode = newChildren[newStartIndex]
    let newEndIndex = newChildren.length - 1
    let newEndVnode = newChildren[newEndIndex]
    let forward = 'head'

    function isSameVnode(oldVnode, newVnode) {
        return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
    }
    // 创建映射表
    function makeIndexByKey(child) {
        let keyMap = {}
        child.forEach((item, index) => {
            if (item.key) {
                keyMap[item.key] = index
            }
        })
        return keyMap
    }
    let map = makeIndexByKey(oldChildren)
    // 2.遍历
    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        // 对比子元素
        // 头部先进行对比（注意是否是同一个元素）
        if (isSameVnode(oldStartVnode, newStartVnode)) { // 头部进行对比
            // 递归
            patch(oldStartVnode, newStartVnode)
            // 移动指针
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else if (isSameVnode(oldEndVnode, newEndVnode)) { // 尾部进行对比
            forward = 'end'
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameVnode(oldStartVnode, newEndVnode)) { // 倒序
            patch(oldStartVnode, newEndVnode)
            parent.insertBefore(oldStartVnode.el, (oldEndVnode.el).nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameVnode(oldEndVnode, newStartVnode)) { // 倒序
            patch(oldEndVnode, newStartVnode)
            parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else { // 暴力比对
            // 1.创建旧元素的映射表
            // 2.新的从老的节点中寻找元素
            let moveIndex = map[newStartVnode.key]
            if (moveIndex === undefined) { // 没有找到
                parent.insertBefore(createEl(newStartVnode), oldStartVnode.el)
            } else { // 获取到旧的元素插入到第一个元素前面即复用
                let moveVnode = oldChildren[moveIndex] // 获取到节点
                oldChildren[moveIndex] = null // 防止数组塌陷
                parent.insertBefore(moveVnode.el, oldStartVnode.el) // 插入
                patch(moveVnode, newStartVnode) // 递归 可能有儿子
            }
            newStartVnode = newChildren[++newStartIndex]
        }
    }
    // 添加新的多余的元素
    if (newStartIndex <= newEndIndex) {
        if (forward === 'head') {
            for (let i = newStartIndex; i <= newEndIndex; i++) {
                parent.appendChild(createEl(newChildren[i]))
            }
        }
        if (forward === 'end') {
            for (let i = newEndIndex; i >= newStartIndex; i--) {
                parent.insertBefore(createEl(newChildren[i]), parent.children[0])
            }
        }
    }
    // 将老的中多余的元素删除
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            let child = oldChildren[i]
            if (child != null) {
                parent.removeChild(child.el)
            }
        }
    }
}

/**
 * vue渲染流程
 *  1、数据初始化
 *  2、对模板进行编译
 *  3、ast变成render字符串和函数
 *  4、通过render函数变成vnode
 *  5、vnode变成真实dom
 *  6、放到页面
 */