<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { Card, Form, Input, Button, Select } from 'ant-design-vue'
import BookTable from './BookTable.vue'
import EditDrawer from './EditDrawer.vue'
import { getCategorys } from '../../api/category'
import useAsync from '../../utils/useAsync'
import { labeledStatement } from '@babel/types'
//异步相关
const { run, loading } = useAsync()

//定义类别列表
const categorys = ref<any[]>([])
// const catergory = ref('')
const keyword = ref('')
const selectCatergory = ref(undefined)
const bookTableRef = ref<InstanceType<typeof BookTable>>()
const editDrawerRef = ref<InstanceType<typeof EditDrawer>>()

const openEdit = (id: number = 0) => {
  editDrawerRef.value?.open(id)
}

//查询书籍列表
const query = () => {

  bookTableRef.value?.query({
    keyword: keyword.value,
    categoryId: selectCatergory.value??""
  })
}

//查询类别列表
const queryCategorys = async (params = {}) => {
  const page = 1;
  const size = 10000;
  const result = await run(getCategorys({ page, size, ...params }))
  console.log(result.items);
  Object.assign(categorys.value, result.items)
}

onBeforeMount(() => {
  queryCategorys()
})
</script>

<template>
  <Card style="margin-bottom: 15px">
    <Form layout="inline">
      <Form.Item label="关键字">
        <Input placeholder="标题/作者" v-model:value="keyword" :allow-clear="true" style="width: 240px" />
      </Form.Item>

      <!-- 下拉框 -->
      <Form.Item label="类别">
        <Select v-model:value="selectCatergory" style="width: 150px" placeholder="请选择" showSearch
          :options="categorys.map(item => ({ value: item.id, label: item.categoryName }))">
        </Select>
        <!-- <Select v-model:value="selectCatergory" style="width: 150px"  placeholder="请选择" showSearch>
            <Select.Option :value="item.id" v-for="item in categorys" :key="item.id">
              {{ item.categoryName }}
            </Select.Option> 
        </Select>-->
      </Form.Item>
      <!-- <Form.Item label="City" >
            <Select v-model:value="catergory"  placeholder="Select your city" style="width: 150px">
              <Select.Option value="beijing">New York</Select.Option>
              <Select.Option value="shanghai">London</Select.Option>
              <Select.Option value="shenzhen">Sydney</Select.Option>
            </Select>
      </Form.Item> -->

      <Form.Item>
        <Button type="primary" @click="query">搜索</Button>
      </Form.Item>
      <Button @click="openEdit()">新增</Button>
    </Form>
  </Card>
  <Card class="p-book-index">
    <BookTable ref="bookTableRef" @edit-click="openEdit" />
  </Card>
  <EditDrawer ref="editDrawerRef" @finish="query()" />
</template>

<style lang="less">
.p-book-index {
  .ant-table-row td {
    padding-top: 5px;
    padding-bottom: 5px;
  }
}
</style>
