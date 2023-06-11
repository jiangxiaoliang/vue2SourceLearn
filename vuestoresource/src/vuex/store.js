import {foreach} from './utils/index'
import { Vue } from './mixin'

// 模块的实现需要树形结构
// root = {
//     _raw: '用户传过来的默认数据',
//     _children: {
//         a: {
//             _raw: '用户传过来的默认数据',
//             _children: {...},
//             state: '数据'
//         },
//         b: {
//             _raw: '用户传过来的默认数据',
//             _children: {...},
//             state: '数据'
//         },
//     },
//     state: '根数据'
// }

export class Store {
    constructor(options) {
        console.log(options)
        // getters 相当于vue中的计算属性具有缓存
        let getters = options.getters
        this.getters = {}
        // Object.keys(getters).forEach(key => {
        //     Object.defineProperty(this.getters, key, {
        //         get: () => {
        //             return getters[key](this.state)
        //         }
        //     })
        // })
        let computed = {}
        foreach(getters, (key, value) => {
            computed[key] = () => {
                return value(this.state)
            }
            Object.defineProperty(this.getters, key, {
                get: () => {
                    return this._vm[key]
                }
            })
        })
        // mutations
        let mutations = options.mutations
        this.mutations = {}
        foreach(mutations, (key, value) => {
            this.mutations[key] = (data) => {
                value(this.state, data)
            }
        })
        // actions
        let actions = options.actions
        this.actions = {}
        foreach(actions, (key, value) => {
            this.actions[key] = (data) => {
                value(this, data)
            }
        })
        // this.state = options.state
        // state响应式
        this._vm = new Vue({
            data: {
                state: options.state
            },
            computed
        })
    }
    get state() {
        return this._vm.state
    }
    commit = (name, data) => {
        this.mutations[name](data)
    }
    dispatch = (name, data) => {
        this.actions[name](data)
    }
}