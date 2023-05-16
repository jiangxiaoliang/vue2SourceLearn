import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input: './src/index.js',
    output: {
        file: 'dist/vue.js',
        format: 'umd', // 同时适配客户端和服务端
        name: 'Vue', // 在客户端上window挂载的名称
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        serve({
            port: 3000,
            contentBase: '', // 空字符串表示当前目录
            openPage: '/index.html'
        })
    ]
}