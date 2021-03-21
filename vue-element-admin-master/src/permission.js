import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

//定义了全局路由守卫
router.beforeEach(async(to, from, next) => {
  
  //启动进度条
  NProgress.start()

  //修改页面标题
  document.title = getPageTitle(to.meta.title)

  //从Cookie获取Token
  const hasToken = getToken()

  //判断Token是否存在
  if (hasToken) {
    //如果当前路径为login则重定向到首页
    if (to.path === '/login') {
      
      next({ path: '/' })
      NProgress.done() 
    } else {
      //判断用户的角色是否存在
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      //如果用户角色存在，则直接访问
      if (hasRoles) {
        next()
      } else {
        try {
          //异步获取用户的角色
         
          const { staffRole } = await store.dispatch('user/getInfo');
          const roles = staffRole;
          console.log('roles',roles);
          //根据用户角色，动态生成路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          //调用router.addRoutes动态添加路由
          router.addRoutes(accessRoutes)
          //使用replace访问路由，不会在history留下记录
          next({ ...to, replace: true })
        } catch (error) {
          //移除token
          await store.dispatch('user/resetToken')
          //显示错误提示
          Message.error(error || 'Has Error')
          //重定向至登录页面
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {

    //如果访问的URL在白名单中，则直接访问
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      //如果访问的URL不在白名单中，则直接重定向到登录页面，并将访问的URL添加到redirect参数中
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  //停止进度条
  NProgress.done()
})
