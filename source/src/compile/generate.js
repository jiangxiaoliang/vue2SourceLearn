/**
 * div id="app">hello - {{msg}}<h1></h1></div>
 * render() {
 *  return _c('div', {id: 'app'}, _v('hello' + _s(msg)), _c(h1))
 * }
 */
var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{}}

function genProps(attrs) {
    let str = ''
    for(let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, val] = item.split(':')
                obj[key] = val
            })
            attr.value = obj
        }
        // 拼接
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}` // 删除最后的逗号
}

function genChildren(el) {
    let children = el.children
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
}

function gen(node) {
    // 两种类型 文本和元素
    if (node.type === 1) { // 元素递归调用
        return generate(node)
    } else { // 文本 区分是否有{{}}
        let text = node.text
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }
        // 有{{}} hello {{name}}, {{msg}} 你好
        let tokens = []
        let lastIndex = defaultTagRE.lastIndex = 0 // 正则表达式test以后lastIndex会变大
        let match
        while (match = defaultTagRE.exec(text)) {
            // console.log(match)
            let index = match.index
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_v(${tokens.join('+')})`
    }
}

export function generate(el) {
    // console.log(el)
    // 需要处理style的属性{id: 'app', style: {color:red,font-szie: 20px}}
    let children = genChildren(el)
    let code = `_c('${el.tag}', ${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'}${children ? `,${children}` : ''})`
    // console.log(code)
    return code
}