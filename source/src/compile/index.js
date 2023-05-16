import { generate } from "./generate";
import { parseHTML } from "./parseAst";

export function compileToFunction(el) {
    // 1.html 转变成 ast语法树
    let ast = parseHTML(el)
    console.log(ast)
    // 2.ast 语法树变成 render函数(a.ast 变成字符串 b.字符串变成render函数)
    let code = generate(ast)
    // 3.将render字符串变成函数
    let render = new Function(`with(this) { return ${code} }`)
    return render
}

// obj = {a: 1, b: 2}
// with(obj) {
//     console.log(a, b)
// }