<template>
  <!-- 面包屑 -->
  <Breadcrumb>
    <BreadcrumbItem v-for="item in menuPathArray" :key="item.path">
      {{ item.name }}
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Breadcrumb } from 'ant-design-vue'
import { menuPathArray } from '../store'

export default defineComponent({
  components: {
    Breadcrumb,
    BreadcrumbItem: Breadcrumb.Item,
  },
  setup() {
    return {
      menuPathArray,
    }
  },
})
</script>
