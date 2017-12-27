import Vue from 'vue';
import App from './App.vue';

import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

import VueRouter from 'vue-router'
import routes from './routes'

import './assets/socket/index'

Vue.use(VueRouter)
Vue.use(ElementUI)

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   //NProgress.start();
//   if (to.path == '/login') {
//     sessionStorage.removeItem('user');
//   }
//   let user = JSON.parse(sessionStorage.getItem('user'));
//   if (!user && to.path != '/login') {
//     next({ path: '/login' })
//   } else {
//     next()
//   }
// })

//router.afterEach(transition => {
//NProgress.done();
//});

//把实例全局抛出来，因为在其他地方调用(request.js里面需要用 $routes)
window.vueInstance = new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  // store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

//定义几个全局变量，对应APP内ready时注入的全局变量。
//用户信息
window.user_info = null;
// //品类ID
// window.device_category_id = 0;
// //设备ID
// window.device_uuid = '';
// //设备名
// window.device_name = '';

HdSmart.ready(()=>{
    console.log()
});
