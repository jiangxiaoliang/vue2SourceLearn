/**
 * ast抽象语法树：css,js,html都可以表示
 *  <div id="app">hello - {{msg}}<h1></h1></div>
 *  {
 *     tag: 'div',
 *     attrs: [{id: 'app'},...],
 *     children: [{tag: null, text: hello},{tag: h1,...}]
 *  }
 */

var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*" // 标签名称
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")" // <span:xx>的标签
var startTagOpen = new RegExp(("^<" + qnameCapture)) // 标签开头的正则
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>")) // 标签结尾的正则
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 属性匹配
var startTagClose = /^\s*(\/?)>/; // 匹配结束的 >
var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{}}

// // 创建ast语法树
// function createAstElement(tag, attrs) {
//     return {
//         tag,
//         attrs,
//         children: [],
//         type: 1,
//         parent: null
//     }
// }
// let root
// let currentParent // 当前父元素
// let stack = [] // 栈结构用来确定当前的父元素是哪一个
// // 开始标签
// function start(tag, attrs) {
//     let element = createAstElement(tag, attrs)
//     if (!root) {
//         root = element
//     }
//     currentParent = element
//     stack.push(element)
// }
// // 文本
// function charts(text) {
//     text = text.replace(/\s/g, '')
//     if(text) {
//         currentParent.children.push({
//             type: 3,
//             text
//         })
//     }
// }
// // 结束标签
// function end(tag) {
//     let element = stack.pop()
//     currentParent = stack[stack.length - 1]
//     if (currentParent) {
//         element.parent = currentParent.tag
//         currentParent.children.push(element)
//     }
// }
export function parseHTML(html) {
    // 创建ast语法树
    function createAstElement(tag, attrs) {
        return {
            tag,
            attrs,
            children: [],
            type: 1,
            parent: null
        }
    }
    let root
    let currentParent // 当前父元素
    let stack = [] // 栈结构用来确定当前的父元素是哪一个
    // 开始标签
    function start(tag, attrs) {
        let element = createAstElement(tag, attrs)
        if (!root) {
            root = element
        }
        currentParent = element
        stack.push(element)
    }
    // 文本
    function charts(text) {
        text = text.replace(/\s/g, '')
        if(text) {
            currentParent.children.push({
                type: 3,
                text
            })
        }
    }
    // 结束标签
    function end(tag) {
        let element = stack.pop()
        currentParent = stack[stack.length - 1]
        if (currentParent) {
            element.parent = currentParent.tag
            currentParent.children.push(element)
        }
    }
    // 开始标签 文本 结束标签
    while(html) {
        // 判断标签 <>
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            // 开始标签
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            // 结束标签
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }
        let text
        if (textEnd > 0) { // 文本
            text = html.substring(0, textEnd)
            // console.log(text)
        }
        if (text) {
            advance(text.length)
            charts(text)
        }
        // break
    }

    function parseStartTag() {
        const start = html.match(startTagOpen)
        // console.log(start)
        if (!start) return
        let match = {
            tagName: start[1],
            attrs: []
        }
        // 删除已经匹配的标签<div
        advance(start[0].length)
        // 属性匹配 注意遍历和结束>
        let attr
        let end
        while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            // console.log(attr)
            match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5]})
            // 继续删除已经匹配的属性
            advance(attr[0].length)
        }
        if (end) {
            // console.log(end)
            advance(end[0].length)
            return match
        }
    }
    function advance(n) {
        html = html.substring(n)
        // console.log(html)
    }
    // console.log(root)
    return root
}