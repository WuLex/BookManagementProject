import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const publicPath = '/'

// console.log(routes);
const router = createRouter({
  history: createWebHashHistory(publicPath),
  routes: routes, //路由数组
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export default router
