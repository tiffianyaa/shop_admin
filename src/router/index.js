import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/Login'
import Home from 'components/Home'
import User from 'components/User'
import Rights from 'components/Rights'
import Roles from 'components/Roles'

Vue.use(Router)
// 下面需要用到路由,存储一下
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/user',
          component: User
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        }
      ]
    }
  ]
})

// 给router注册一个导航守卫
// 将来所有的导航(路由发生了跳转),都要经过导航守卫
router.beforeEach((to, from, next) => {
  // 如果是去登录页的,直接放行
  if (to.path === '/login') {
    next()
  }
  // 去其他页面的,需要检查token
  let token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})
// 导出路由
export default router
