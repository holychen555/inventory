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
        title: '首页',
        icon: 'dashboard',
        affix: true
      }
    }]
  },
  {
    path: "/goods/info",
    component: Layout,
    hidden: true,
    children: [
        {
            path: "/goods/info",
            component: () => import('@/views/base/components/goodsInfo'),
            name: "goodsinfo",
            meta: {
                title: '商品信息',
            },
        },
    ],
  },
  {
    path: "/purchase/detail/:orderId",
    component: Layout,
    hidden: true,
    children: [
        {
            path: "/purchase/detail/:orderId",
            component: () => import('@/views/purchase/detail'),
            name: "purchasedetail",
            meta: {
                title: '单据详情',
            },
        },
    ],
  },
  {
    path: "/sales/detail/:orderId",
    component: Layout,
    hidden: true,
    children: [
        {
            path: "/sales/detail/:orderId",
            component: () => import('@/views/sales/detail'),
            name: "salesdetail",
            meta: {
                title: '单据详情',
            },
        },
    ],
  },
  {
    path: "/stock/check/order",
    component: Layout,
    hidden: true,
    children: [
        {
            path: "/stock/check/order",
            component: () => import('@/views/stock/check-order'),
            name: "checkOrder",
            meta: {
                title: '库存盘点单',
            },
        },
    ],
  },
  {
    path: "/stock/check/order/:orderId",
    component: Layout,
    hidden: true,
    children: [
        {
            path: "/stock/check/order/:orderId",
            component: () => import('@/views/stock/check-order'),
            name: "checkOrderDetail",
            meta: {
                title: '盘点单详情',
            },
        },
    ],
  },
  
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/order',
    meta: {
      title: '采购管理',
      icon: 'shopping',
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
        meta: {title: '采购订单',roles:['editor']}
      },
      {
        name: 'yrkd',
        path: '/purchase/order/yrkd',
        component: () => import('@/views/purchase/order'),
        meta: {title: '预入库单',roles:['admin']}
      },
      {
        name: 'cgrk',
        path: '/purchase/order/cgrk',
        component: () => import('@/views/purchase/order'),
        meta: {title: '采购入库单',roles:['admin']}
      },
      {
        name: 'cgth',
        path: '/purchase/order/cgth',
        component: () => import('@/views/purchase/order'),
        meta: {title: '采购退货单',roles:['admin']}
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
    path: '/sales',
    component: Layout,
    redirect: '/sales/order/xsdd',
    meta: {
      title: '销售管理',
      icon: 'peoples',
      roles:['admin']
    },
    children: [
      {
        name: 'xsdd',
        path: '/sales/order/xsdd',
        component: () => import('@/views/sales/order'),
        meta: {title: '销售订单',roles:['admin']}
      },
      {
        name: 'xsck',
        path: '/sales/order/xsck',
        component: () => import('@/views/sales/order'),
        meta: {title: '销售出库单',roles:['admin']}
      },
      {
        name: 'xsth',
        path: '/sales/order/xsth',
        component: () => import('@/views/sales/order'),
        meta: {title: '销售退货单',roles:['admin']}
      },
      {
        name: 'salesOrderList',
        path: '/sales/order/list',
        component: () => import('@/views/sales/list'),
        meta: {title: '销售单据列表',roles:['admin']}
      },
      {
        name: 'salesRecord',
        path: '/sales/record',
        component: () => import('@/views/sales/record'),
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
      icon: 'el-icon-s-home',
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
        name: 'warning',
        path: '/stock/warning',
        component: () => import('@/views/stock/warning'),
        meta: {title: '库存预警',roles:['admin']}
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance',
    meta: {
      title: '财务管理',
      icon: 'el-icon-s-finance',
      roles:['admin']
    },
    children: [
      {
        name: 'collectings',
        path: '/finance/index',
        component: () => import('@/views/finance/index'),
        meta: {title: '财务管理',roles:['admin']}
      },
    ]
  },
  {
    path: '/reports',
    component: Layout,
    redirect: '/reports/purchases',
    meta: {
      title: '报表',
      icon: 'el-icon-s-data',
      roles:['admin']
    },
    children: [
      {
        name: 'purchases',
        path: '/reports/purchases',
        component: () => import('@/views/reports/purchases'),
        meta: {title: '采购明细报表',roles:['admin']}
      },
      {
        name: 'sales',
        path: '/reports/sales',
        component: () => import('@/views/reports/sales'),
        meta: {title: '销售明细报表',roles:['admin']}
      },
      {
        name: 'profit-report',
        path: '/reports/profit-report',
        component: () => import('@/views/reports/profit-report'),
        meta: {title: '利润报表',roles:['admin']}
      },
    ]
  },
  {
    path: '/base',
    component: Layout,
    redirect: '/base/goods',
    meta: {
      title: '基础资料',
      icon: 'documentation',
      roles:['admin']
    },
    children: [
      {
        name: 'goods',
        path: '/base/goods',
        component: () => import('@/views/base/goods'),
        meta: {title: '商品',roles:['admin']}
      },
      {
        name: 'customer',
        path: '/base/customer',
        component: () => import('@/views/base/customer'),
        meta: {title: '客户',roles:['admin']}
      },
      {
        name: 'vendor',
        path: '/base/vendor',
        component: () => import('@/views/base/vendor'),
        meta: {title: '供应商',roles:['admin']}
      },
      {
        name: 'stock',
        path: '/base/warehouse',
        component: () => import('@/views/base/warehouse'),
        meta: {title: '仓库',roles:['admin']}
      },
      {
        name: 'stock',
        path: '/base/staff',
        component: () => import('@/views/base/staff'),
        meta: {title: '用户',roles:['admin']}
      },
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
