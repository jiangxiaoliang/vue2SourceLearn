import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router/index'

Vue.config.productionTip = false

new Vue({
  name: 'Root',
  render: h => h(App),
  store,
  router
}).$mount('#app')