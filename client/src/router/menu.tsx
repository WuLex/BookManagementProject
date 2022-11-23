import type Menu from '../models/Menu'

import { AppstoreAddOutlined, TagsOutlined,BookOutlined} from '@ant-design/icons-vue'

export const homeMenu: Menu = {
  name: '书籍管理',
  path: '/books',
  icon: <AppstoreAddOutlined />,
  component: () => import('../pages/book/index.vue'),
}

export const categoryMenu: Menu = {
  name: '类别管理',
  path: '/categorys',
  icon: <BookOutlined />,
  component: () => import('../pages/category/index.vue'),
}


// const categorymenu: Menu[] = [
//   {
//     name: '架构',
//     path: '/books',
//     icon: <TagsOutlined />,
//     component: () => import('../pages/tag/index.vue')
//   },
//   {
//     name: 'NET',
//     path: '/book1s',
//     icon: <TagsOutlined />,
//     component: () => import('../pages/tag/index.vue')
//   },
//   {
//     name: 'JAVA',
//     path: '/book2s',
//     icon: <TagsOutlined />,
//     component: () => import('../pages/tag/index.vue')
//   },
//   {
//     name: '分布式',
//     path: '/book3s',
//     icon: <TagsOutlined />,
//     component: () => import('../pages/tag/index.vue')
//   },
//   {
//     name: '人生',
//     path: '/book4s',
//     icon: <TagsOutlined />,
//     component: () => import('../pages/tag/index.vue')
//   }
// ]

// export const homeMenu: Menu = {
//   name: '书籍管理',
//   icon: <AppstoreAddOutlined />,
//   children: categorymenu
// }

const menu: Menu[] = [
  homeMenu,
  categoryMenu,
  {
    name: '标签管理',
    path: '/tags',
    icon: <TagsOutlined />,
    component: () => import('../pages/tag/index.vue'),
  },
]

export default menu
