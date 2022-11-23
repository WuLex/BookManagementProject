import type { RouteRecordRaw } from 'vue-router'
import Menu, { MenuItem, SubMenu } from '../models/Menu'
import menu, { homeMenu } from './menu'

//404
import NotFound from '../pages/404.vue'

//动态加载布局组件
const Layout = () => import('../layout/AppLayout.vue')

//定义路由类型数组
const menuRoutes: RouteRecordRaw[] = []

const mapRoute = (menu: Menu) => {
  const subMenu = menu as SubMenu
  //如果N级菜单还有子菜单
  if (subMenu.children) {
    for (const item of subMenu.children) {
      mapRoute(item)
    }
  } else {
    //一级菜单 / 没有子菜单的N级菜单
    const menuItem = menu as MenuItem
    menuRoutes.push({
      path: menuItem.path,
      component: menuItem.component,
    })
  }
}

menu.forEach(mapRoute)

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: homeMenu.path,
    children: menuRoutes,
  },
  {
    //404错误页
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]
// console.log(menuRoutes);
export default routes
