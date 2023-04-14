import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import styleImport from 'vite-plugin-style-import'

const stylePlugin = styleImport({
  libs: [
    {
      libraryName: 'ant-design-vue',
      esModule: true,
      resolveStyle: (name) => {
        // 这里是无需额外引入样式文件的“子组件”列表
        const ignoreList = [
          'anchor-link',
          'sub-menu',
          'menu-item',
          'menu-divider',
          'menu-item-group',
          'breadcrumb-item',
          'breadcrumb-separator',
          'form-item',
          'step',
          'select-option',
          'select-opt-group',
          'card-grid',
          'card-meta',
          'collapse-panel',
          'descriptions-item',
          'list-item',
          'list-item-meta',
          'table-column',
          'table-column-group',
          'tab-pane',
          'tab-content',
          'timeline-item',
          'tree-node',
          'skeleton-input',
          'skeleton-avatar',
          'skeleton-title',
          'skeleton-paragraph',
          'skeleton-image',
          'skeleton-button',
        ]
        // 这里是需要额外引入样式的子组件列表
        // 单独引入子组件时需引入组件样式，否则会在打包后导致子组件样式丢失
        const replaceList = {
          'typography-text': 'typography',
          'typography-title': 'typography',
          'typography-paragraph': 'typography',
          'typography-link': 'typography',
          'dropdown-button': 'dropdown',
          'input-password': 'input',
          'input-search': 'input',
          'input-group': 'input',
          textarea: 'input',
          'radio-group': 'radio',
          'checkbox-group': 'checkbox',
          'layout-sider': 'layout',
          'layout-content': 'layout',
          'layout-footer': 'layout',
          'layout-header': 'layout',
          'month-picker': 'date-picker',
        }
        return ignoreList.includes(name)
          ? ''
          : replaceList.hasOwnProperty(name)
          ? `ant-design-vue/es/${replaceList[name]}/style`
          : `ant-design-vue/es/${name}/style`
      },
    },
  ],
})

export default defineConfig({
  plugins: [vue(), vueJsx(), stylePlugin],
  base: '/admin/',  //前端地址
  publicDir: 'client/public',
  build: {
    outDir: '../build/wwwroot/admin',
  },
  server: {
    proxy: {
      //表示匹配以斜杠 / 开头且不包含字符串 "admin" 的所有请求地址。
      //如果一个请求地址满足这个正则，它将被代理到 http://localhost:5000 这个后台地址。
      //如果有以下字符串：
      //"user1"
      //"user2"
      //"admin1"
      //"guest"
      //那么使用该正则表达式匹配后，将会匹配到 "user1", "user2", 和 "guest" 这三个字符串，而 "admin1" 则不会被匹配到。
      '^/(?!admin)': 'http://localhost:5000', 
      //它表示匹配以斜杠 /api 开头的所有请求地址。
      //如果一个请求地址满足这个正则，它将被代理到 http://localhost:5000/api 这个后台 API 地址。
      '^/api': 'http://localhost:5000/api', //后台api
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
