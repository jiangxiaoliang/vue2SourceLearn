let callback = []
let pending = false
function flush() {
    callback.forEach(cb => cb())
    pending = false
}
let timerFunc
if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flush)
    }
} else if (MutationObserver) { // h5 异步方法，可以监听dom变化，监听完毕之后来异步更新
    let observe = new MutationObserver(flush)
    let textNode = document.createTextNode(1)
    observe.observe(textNode, { characterData: true }) // 检测文本内容变化
    timerFunc = () => {
        textNode.textContent = 2
    }
} else if (setImmediate) { // ie
    timerFunc = () => {
        setImmediate(flush)
    }
} else {
    timerFunc = () => {
        setTimeout(flush)
    }
}
export function nextTick(cb) {
    // 队列[cb1, cb2]
    callback.push(cb)
    if (!pending) {
        timerFunc() // 异步处理函数 需要处理兼容问题，vue3使用的是Promise.then
        pending = true
    }
}