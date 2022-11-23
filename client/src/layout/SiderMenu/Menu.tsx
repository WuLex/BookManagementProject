import { ref, defineComponent, watch } from 'vue'
import { Menu } from 'ant-design-vue'

import router from '../../router'
import menuData from '../../router/menu'
import { menuCollapsed, menuPathArray } from '../../store'
import type { MenuItem, SubMenu } from '../../models/Menu'
import type MenuModel from '../../models/Menu'

import { isSubMenu, isPathInMenu, getOpenMenuKeys, getMenuPathArray } from './util'

export default defineComponent({
  setup() {
    const openKeys = ref<string[]>([])
    const selectKeys = ref<string[]>([])

    let isRouteChangeFromMenu = false

    function findSubMenuByKey(menuKey: string): SubMenu {
      return menuData
        .filter(isSubMenu)
        .find((menu) => isPathInMenu(menuKey, menu as SubMenu)) as SubMenu
    }

    function setOpenKeys(path: string) {
      const subMenu = findSubMenuByKey(path)
      if (subMenu) {
        openKeys.value = getOpenMenuKeys(path, subMenu)
      }
    }

    function setSelectKeys(key: string) {
      selectKeys.value = [key]
    }

    function onSelect({ key }: any) {
      setSelectKeys(key)
      isRouteChangeFromMenu = true
      router.push(key)

      // 若选择的是非SubMenu，则关闭所有SubMenu
      if (menuData.find((x) => x.path == key)) {
        openKeys.value = []
      }
    }

    function onOpenChange(value: any[]) {
      const lastOpenKey = value.find((key) => openKeys.value.indexOf(key) === -1)
      if (lastOpenKey) {
        setOpenKeys(lastOpenKey)
      } else {
        openKeys.value = value
      }
    }

    watch(
      () => router.currentRoute.value.path,
      (path) => {
        if (!isRouteChangeFromMenu) {
          setOpenKeys(path)
          setSelectKeys(path)
        }
        isRouteChangeFromMenu = false
        menuPathArray.value = getMenuPathArray(path, menuData)
      },
      { immediate: true }
    )

    watch(
      () => menuCollapsed.value,
      () => {
        if (menuCollapsed.value) {
          openKeys.value = []
        } else {
          setOpenKeys(router.currentRoute.value.path)
        }
      }
    )

    const renderMenuItem = (item: MenuItem) => {
      return (
        <Menu.Item key={item.path}>
          {item.icon || <></>}
          <span>{item.name}</span>
        </Menu.Item>
      )
    }

    const renderSubMenu = (item: SubMenu) => {
      const title = (
        <>
          {item.icon}
          <span>{item.name}</span>
        </>
      )
      return (
        <Menu.SubMenu key={item.path} title={title}>
          {item.children.map(renderMenu)}
        </Menu.SubMenu>
      )
    }

    const renderMenu = (item: MenuModel) => {
      const subMenu = item as SubMenu
      return subMenu.children ? renderSubMenu(subMenu) : renderMenuItem(item as MenuItem)
    }

    return () => (
      <Menu
        theme="dark" //主题颜色
        mode="inline" //菜单类型，现在支持垂直、水平、和内嵌模式三种
        inlineIndent={20} //inline 模式的菜单缩进宽度
        openKeys={openKeys.value} //当前展开的 SubMenu 菜单项 key 数组
        selectedKeys={selectKeys.value} //当前选中的菜单项 key 数组
        onOpenChange={onOpenChange}  //SubMenu 展开/关闭的回调
        onSelect={onSelect} //被选中时调用
        
      >
        {menuData.map(renderMenu)}
      </Menu>
    )
  },
})
