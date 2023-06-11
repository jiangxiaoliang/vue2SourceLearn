import Vue from 'vue'
import Vuex from 'vuex'
// import Vuex from '../vuex/index'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        age: 10
    },
    getters: {
        brothAge(state) {
            console.log('缓存属性')
            return state.age + 5
        }
    },
    mutations: {
        addAge(state, payload) {
            state.age = state.age + payload
        }
    },
    actions: {
        addAge({ commit }, payload) {
            setTimeout(() => {
                commit('addAge', payload)
            }, 2000)
        }
    },
    modules: {
        a: {
            state: {
                age: 20
            },
            mutations: {
                addAge(state, payload) {
                    state.age = state.age + payload
                }
            }
        },
        b: {
            state: {
                age: 30
            },
            mutations: {
                addAge(state, payload) {
                    state.age = state.age + payload
                }
            }
        }
    }
})

export default store