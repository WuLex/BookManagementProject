<script lang="tsx" setup>
import { onMounted, reactive, ref, toRaw, computed } from 'vue'
import { Card, Form, Input, Button, Modal, Spin, Popconfirm, Empty, Row, Col, Switch, Table } from 'ant-design-vue'
import type { ColumnProps } from 'ant-design-vue/lib/table'
import { EditOutlined, DeleteOutlined, LeftCircleFilled } from '@ant-design/icons-vue'
import { deleteCategory, getCategorys, saveCategory } from '../../api/category'
import useAsync from '../../utils/useAsync'
import dayjs from 'dayjs'

const keyword = ref('')
const categorys = ref<any[]>([])
const modalVisible = ref(false)
const checkedstatus = ref(false)

const form = reactive({
  id: 0,
  //  name: '',
  status: 0,
  categoryName: '',
  description: '',
})

const { resetFields, validate, validateInfos } = Form.useForm(
  form,
  reactive({
    categoryName: [{ required: true, message: '此项不能为空' }],
    description: [{ required: true, message: '此项不能为空' }],
  })
)

//异步相关
const { run, loading } = useAsync()

//查询列表
// const query = async () => {
//   categorys.value = await run(getCategorys({ keyword: keyword.value }))
//   console.log(categorys.value);
// }




//编辑一条数据
const openEdit = (category?: object) => {
  resetFields(category)
  modalVisible.value = true
}


//处理表单提交
const handleSubmit = async () => {
  try {
    await validate()
    console.log(toRaw(form));
    //此处改为number类型
    form.status = Number(form.status);
    await run(saveCategory(toRaw(form)))
    modalVisible.value = false
    query()
  } catch (e) { }
}


//处理删除一条记录
const handleDelete = async (id: number) => {
  await run(deleteCategory(id))
  query()
}

const updatestatus = async (val: any) => {
  console.log("updatestatus", val);
  form.status = Number(val);
  await run(handleSubmit());
};


onMounted(() => {
  query()
})

//  -------------------------------------------------
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
}

const formState = reactive({
  user: {
    name: '',
    age: undefined,
    email: '',
    website: '',
    introduction: '',
  },
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}

// -------------------------------
//表格数据定义
const data = reactive<any>({})

//分页数据定义
const pagination = computed(() => ({
  total: data.total,
  current: data.page,
  pageSize: data.size,
}))

//分页查询
const handleTableChange = ({ current, pageSize, keyword }: any) => {

  // console.log(current, pageSize);
  query({ page: current, size: pageSize, keyword: keyword })
}

//按钮搜索查询
const searchQuery = () => {
  query({ keyword: keyword.value })
}

//查询类别列表
const query = async (params = {}) => {
  const page = pagination?.value.current || 1;
  const size = pagination?.value.pageSize || 10;
  const result = await run(getCategorys({ page, size, ...params }))
  // console.log(result);
  Object.assign(data, result)
}


//父组件
// defineExpose({ query })

//表格列定义
const columns: ColumnProps[] = [
  {
    title: '类别名称',
    dataIndex: 'categoryName',
    //  fixed: 'left',
    width: 80,
    // customRender: (r: any) => <img src={r.text} style="height:55px" />,
  },
  {
    title: '类别描述',
    dataIndex: 'description',
    ellipsis: true,
    width: 320,
    // customRender: ({ record }: any) => (
    //   <>
    //     <div>{record.title}</div>
    //     <div style="line-height:1.4;font-size:12px;color:#777;">{record.subtitle}</div>
    //   </>
    // ),
  },
  // {
  //   title: '作者',
  //   dataIndex: 'author',
  //   width: 120,
  //   ellipsis: true,
  // },
  // {
  //     title:'是否启用',
  //     dataIndex:'Status',
  //     key:'status',
  //     className: 'columnCenter',
  //     width:100,
  //     customRender:({record }: any)=>(
  //         <Switch checkedChildren="是" unCheckedChildren="否"
  //                 onChange={(checked) => updatestatus(checked)}
  //                 checked={Boolean(record.status)} 
  //         />
  //     )
  // },
  {
    title: '创建日期',
    dataIndex: 'createDate',
    width: 100,
    align: 'center',
    customRender: ({ text }: any) => text ? dayjs(text).format('YYYY-MM-DD hh:mm:ss') : ''  //时间格式化
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 135,
    // fixed: 'right',
    align: 'center',
    customRender: ({ record }: any) => (
      <>
        <Button size="small" onClick={() => openEdit(record)} style="margin-right:5px">
          编辑
        </Button>
        <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record.id)}>
          <Button size="small" type="dashed">
            删除
          </Button>
        </Popconfirm>

        {/* 以上组件加了会不断render */}
      </>
    ),
  },
]

</script>

<template>
  <Card style="margin-bottom: 15px">
    <Form layout="inline">
      <Form.Item label="关键字">
        <Input v-model:value="keyword" :allow-clear="true" style="width: 240px" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" @click="searchQuery()">搜索</Button>
      </Form.Item>
      <Form.Item>
        <Button @click="openEdit()">新增</Button>
      </Form.Item>
      <Form.Item>
        <Button @click="query()">查询测试</Button>
      </Form.Item>
    </Form>
  </Card>

  <Card>

    <Table row-key="id" :columns="columns" :data-source="data.items" bordered :pagination="pagination"
      :loading="loading" @change="handleTableChange"></Table>


    <!-- <Spin :spinning="loading"> -->
    <!-- <Empty v-if="categorys.length == 0" /> -->
    <!-- <Row :gutter="20">
        <Col :span="4" v-for="category in categorys">
          <Card size="small" style="margin-bottom: 15px">
            <Card.Meta :title="category.name" :description="`书籍数 · ${category.bookCount}`" />
            <template #actions>
              <EditOutlined @click="openEdit(category)" />
              <Popconfirm title="确定要删除吗？" @confirm="handleDelete(category.id)">
                <DeleteOutlined />
              </Popconfirm>
            </template>
          </Card>
        </Col>
      </Row> -->
    <!-- </Spin> -->
  </Card>

  <Modal v-model:visible="modalVisible" :title="form.id ? '编辑类别' : '新增类别'" :confirm-loading="loading"
    @ok="handleSubmit">
    <Form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" :validate-messages="{ validateMessages }">
      <Form.Item label="类别名" v-bind="validateInfos.categoryName">
        <Input v-model:value="form.categoryName" />
      </Form.Item>
      <Form.Item label="是否启用" v-bind="validateInfos.status">
        <Switch :checked="Boolean(form.status)" @change="checked => (checked ? form.status = 1 : form.status = 0)" />
      </Form.Item>
      <Form.Item label="类别说明" v-bind="validateInfos.description">
        <Input.TextArea v-model:value="form.description" />
      </Form.Item>
      <!-- <Form.Item label="Email" :rules="[{ type: 'email' }]">
        <Input v-model:value="form.name" />
      </Form.Item> -->
      <!-- <Form.Item label="Age" :rules="[{ type: 'number', min: 0, max: 99 }]">
        <InputNumber />
      </Form.Item> -->
      <!-- <Form.Item label="Website">
        <Input v-model:value="form.name" />
      </Form.Item> -->
      <!-- <Form.Item label="Introduction">
        <Input.TextArea />
      </Form.Item> -->
    </Form>
  </Modal>
</template>

<style lang="less">
.ant-card-actions>li {
  margin: 6px 0;
}
</style>

 

