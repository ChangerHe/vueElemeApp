import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'

// 全局引用样式文件, 因为在webpack base中配置了common的指向, 所以这里可以直接使用common
import 'common/stylus/index.styl'

// 引入之后,需要将路由进行使用
Vue.use(VueRouter)

// 使用VueResource
Vue.use(VueResource)

// 挂载app组件, 相当于 new Vue({components: App})
let app = Vue.extend(App)

// 实例化一个vue-router对象
let router = new VueRouter({
  // 指定一个激活时默认的class
  linkActiveClass: 'active'
})

// 定义router的路由组件
router.map({
  '/goods': {
    component: goods
  },
  '/ratings': {
    component: ratings
  },
  '/seller': {
    component: seller
  }
})

// 启动这个路由,并且将路由挂载到index 的id为app的组件上
router.start(app, '#app')

// 使跳转时默认跳转到goods这个路由页面
// router.go('/goods')
