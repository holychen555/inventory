import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  //检查路由是否包含meta和meta.roles属性
  if (route.meta && route.meta.roles) {
    //判断route.meta.roles中是否包含用户角色roles中的任何一个权限，如果包含则放回true,否则返回false
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    //如果路由没有meta或meta.roles属性，则认为该路由不需要进行权限控制，所有用户对该路由都具有访问权限
    return true
  }
}

/**
 * @param routes 异步加载的路由
 * @param roles 用户的角色，数组形式
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  //遍历全部路由
  routes.forEach(route => {
    //对路由进行浅拷贝，注意children不会拷贝，因为不需要对children进行判断，所以可以使用浅拷贝
    const tmp = { ...route }
    //检查用户角色是否具备访问路由的权限
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        //当路由包含children时，对children迭代调用filterAsyncRouters方法
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      //当路由具有访问权限时，将tmp保存到res中
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    //将routes保存到state中的addRoutes
    state.addRoutes = routes
    //将routes集成到src/router/index.js的constantRoutes中
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    //返回Promise对象
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        //如果角色中包含admin,则直接跳过判断，直接将asyncRouter全部返回
        accessedRoutes = asyncRoutes || []
      } else {
        //如果角色中没有包含admin,则调用filterAsyncRouters过滤路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      //将路由保存在vuex中
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
