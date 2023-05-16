import { initGlobalApi } from "./global-api/index"
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index"
import { stateMixin } from "./initState"
import { compileToFunction } from "./compile/index"
import { createEl, patch } from "./vnode/patch"

function Vue(options) {
    // 初始化
    this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
stateMixin(Vue) // 给vm添加$nextTick

// 全局的方法 Vue.minin,Vue.component,Vue.extend
initGlobalApi(Vue)

// 创建虚拟dom
// let vm1 = new Vue({
//     data: {
//         name: '张三'
//     }
// })
// // let render1 = compileToFunction(`<div id="a" style="color: red">{{name}}</div>`)
// let render1 = compileToFunction(`<ul>
//         <li style="background:red" key="a">a</li>
//         <li style="background:pink" key="b">b</li>
//         <li style="background:blue" key="c">c</li>
//         <li style="background:blue" key="d">d</li>
//     </ul>`)
// let vnode1 = render1.call(vm1)
// document.body.appendChild(createEl(vnode1))
// // 数据更新
// let vm2 = new Vue({
//     data: {
//         name: '李四'
//     }
// })
// let render2 = compileToFunction(`<p id="a">{{name}}</p>`)
// let render2 = compileToFunction(`<div id="b" style="color: red">{{name}}</div>`)
// 开头一样
// let render2 = compileToFunction(`<ul>
//         <li style="background:red" key="a">a</li>
//         <li style="background:pink" key="b">b</li>
//         <li style="background:blue" key="c">c</li>
//         <li style="background:yellow" key="d">d</li>
//     </ul>`)

// 结尾一样
// let render2 = compileToFunction(`<ul>
//     <li style="background:yellow" key="e">e</li>
//     <li style="background:yellow" key="d">d</li>
//     <li style="background:red" key="a">a</li>
//     <li style="background:pink" key="b">b</li>
//     <li style="background:blue" key="c">c</li>
// </ul>`)

// 倒叙
// let render2 = compileToFunction(`<ul>
//     <li style="background:blue" key="d">d</li>
//     <li style="background:red" key="c">c</li>
//     <li style="background:pink" key="b">b</li>
//     <li style="background:blue" key="a">a</li>
// </ul>`)

// 倒叙
// let render2 = compileToFunction(`<ul>
//     <li style="background:blue" key="d">d</li>
//     <li style="background:red" key="c">c</li>
//     <li style="background:pink" key="b">b</li>
// </ul>`)

// 暴力比对
// let render2 = compileToFunction(`<ul>
//     <li style="background:blue" key="f">f</li>
//     <li style="background:red" key="h">h</li>
//     <li style="background:pink" key="i">i</li>
// </ul>`)
// let vnode2 = render2.call(vm2)
// // patch 比对
// // patch(vnode1, vnode2)
// setTimeout(() => {
//     patch(vnode1,vnode2)
// }, 2000)

export default Vue