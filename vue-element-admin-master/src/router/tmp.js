import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',//使用路由通配符*来匹配更多的路由
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: {
        title: '工作台',
        icon: 'dashboard',
        affix: true
      }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/book',
    component: Layout,
    redirect: '/book/create',
    meta: {
      title: '图书管理',
      icon: 'documentation',
      roles:['admin']
    },
    children: [
      {
        name: 'bookCreate',
        path: '/book/create',
        component: () => import('@/views/book/create'),
        meta: {title: '上传图书',icon: 'edit',roles:['admin']}
      },
      {
        name: 'bookList',
        path: '/book/list',
        component: () => import('@/views/book/list'),
        meta: {title: '图书列表',icon: 'list',roles:['admin']}
      },
      {
        name: 'bookEdit',
        path: '/book/edit/:fileName',
        component: () => import('@/views/book/edit'),
        hidden: true,
        meta: {title: '编辑图书',icon: 'edit',roles:['admin'],activeMenu:'/book/list'}
      }
    ]
  },
  {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/order?type=ycgd',
    meta: {
      title: '采购管理',
      icon: 'documentation',
      roles:['admin']
    },
    children: [
      {
        name: 'ycgd',
        path: '/purchase/order/ycgd',
        component: () => import('@/views/purchase/order'),
        meta: {title: '预采购单',roles:['admin']}
      },
      {
        name: 'cgdd',
        path: '/purchase/order/cgdd',
        component: () => import('@/views/purchase/order'),
        meta: {title: '采购订单',roles:['admin']}
      },
      {
        name: 'cgrk',
        path: '/purchase/order/cgrk',
        component: () => import('@/views/purchase/order'),
        meta: {title: '采购入库单',roles:['admin']}
      },
      {
        name: 'purchase_list',
        path: '/purchase/order/list',
        component: () => import('@/views/purchase/list'),
        meta: {title: '采购单据列表',roles:['admin']}
      },
    ]
  },
  {
    path: '/sale',
    component: Layout,
    redirect: '/sale/order/xsdd',
    meta: {
      title: '销售管理',
      icon: 'documentation',
      roles:['admin']
    },
    children: [
      {
        name: 'xsdd',
        path: '/sale/order/xsdd',
        component: () => import('@/views/sale/order'),
        meta: {title: '销售订单',roles:['admin']}
      },
      {
        name: 'xsck',
        path: '/sale/order/xsck',
        component: () => import('@/views/sale/order'),
        meta: {title: '销售出库单',roles:['admin']}
      },
      {
        name: 'xsth',
        path: '/sale/order/xsth',
        component: () => import('@/views/sale/order'),
        meta: {title: '销售退货单',roles:['admin']}
      },
      {
        name: 'saleOrderList',
        path: '/sale/order/list',
        component: () => import('@/views/sale/list'),
        meta: {title: '销售单据列表',roles:['admin']}
      },
      {
        name: 'saleResult',
        path: '/sale/result',
        component: () => import('@/views/sale/result'),
        meta: {title: '销售业绩',roles:['admin']}
      },
    ]
  },
  {
    path: '/stock',
    component: Layout,
    redirect: '/stock/check',
    meta: {
      title: '库存管理',
      icon: 'documentation',
      roles:['admin']
    },
    children: [
      {
        name: 'check',
        path: '/stock/check',
        component: () => import('@/views/stock/check'),
        meta: {title: '盘点',roles:['admin']}
      },
      {
        name: 'spth',
        path: '/stock/spth',
        component: () => import('@/views/stock/return'),
        meta: {title: '商品退货单',roles:['admin']}
      },
      {
        name: 'warning',
        path: '/stock/warning',
        component: () => import('@/views/stock/warning'),
        meta: {title: '库存预警',roles:['admin']}
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
