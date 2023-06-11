import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from '../vue-router/index'

Vue.use(VueRouter)

import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "abount" */ '../views/About.vue'),
        children: [
            {
                path: 'a',
                name: 'a',
                component: {render: (h) => <div>a页面</div>}
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    console.log(1)
    setTimeout(() => {
        next()
    }, 1000)
})
router.beforeEach((to, from, next) => {
    console.log(2)
    setTimeout(() => {
        next()
    }, 1000)
})

export default router