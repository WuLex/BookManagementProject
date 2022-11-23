<script lang="ts" setup>
import { onMounted, reactive, ref, toRaw } from 'vue'
import {
  Drawer,
  Form,
  Button,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Upload,
  Spin,
  message,
} from 'ant-design-vue'
import { FormInstance } from 'ant-design-vue/es/form/Form'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import IntroEditor from '../../comps/Editor'
import useAsync from '../../utils/useAsync'
import { getQiniuToken, saveBook, getBookById } from '../../api/book'
import { getTags } from '../../api/tag'
import { getCategorys } from '../../api/category'

const emit = defineEmits<{
  (e: 'finish', data: object): void
}>()

const form = reactive({
  id: 0,
  title: '',
  subtitle: '',
  author: '',
  isbn: '',
  pubDate: undefined,
  cover: '',
  coverUrl: '',
  orgUrl: '',
  tags: [],
  fetchUrl: '',
  fetchCode: '',
  formats: [],
  intro: '',
  categoryId: undefined
})

const rules = {
  title: [{ required: true, message: '此项不能为空' }],
  pubDate: [{ required: true, message: '此项不能为空' }],
  cover: [{ required: true, message: '请上传封面' }],
  tags: [{ required: true, message: '此项不能为空' }],
  fetchUrl: [{ required: true, message: '此项不能为空' }],
  formats: [{ required: true, message: '此项不能为空' }],
  intro: [{ required: true, message: '此项不能为空' }],
  categoryId: [{ pattern: /^\+?[1-9]\d*$/, required: true, message: '请选择此项' }],
  orgUrl: [{ pattern:  /^(?:(http|https|ftp):\/\/)?((|[\w-]+\.)+[a-z0-9]+)(?:(\/[^/?#]+)*)?(\?[^#]+)?(#.+)?$/i,  message: '请填写正确的链接地址' }]
}

const visible = ref(false)

const uploading = ref(false)

const formRef = ref<FormInstance>()

const tagOptions = ref<any[]>([])
//定义类别列表
const categoryOptions = ref<any[]>([])

const formatOptions = ['PDF', 'EPUB', 'AZW3', 'MOBI', '压缩包', '文件夹', '源代码'].map((x) => ({
  value: x,
  label: x,
}))

//标签遍历
const mapTagOptions = (tags: any[]) => tags.map((x: any) => ({ value: x.name, label: x.name }))

//分类遍历
const mapCategoryOptions = (categorylist: any[]) => categorylist.map((x: any) => ({ value: x.id, label: x.categoryName }))


const qiniuToken = ref('')

onMounted(async () => {
  const tags = await run(getTags())
  tagOptions.value = mapTagOptions(tags)

  const categorylist = await run(getCategorys())
  categoryOptions.value = mapCategoryOptions(categorylist.items)
  console.log(categoryOptions.value);
  
  //添加默认选项
  // categoryOptions.value.push({
  //   "value": 0,
  //   "label": "请选择书籍类别"
  // })
  // form.categoryId = categoryOptions.value[0].value;
  //console.log("categoryId", form.categoryId);
})

const beforeUpload = async (file: File) => {
  if (file.size / 1024 / 1024 > 2) {
    message.error('图片不能大于 2MB!')
    return false
  }
  qiniuToken.value = await getQiniuToken()
  return true
}

const handleUpload = (info: any) => {
  if (info.file.status === 'uploading') {
    uploading.value = true
    return
  }
  if (info.file.status === 'done') {
    const { key, url } = info.file.response
    form.cover = key
    form.coverUrl = url
    uploading.value = false
  }
  if (info.file.status === 'error') {
    uploading.value = false
    message.error('图片上传出错！')
  }
}

const { run, loading } = useAsync()

const handleSubmit = async () => {
  const data = toRaw(form)
  await run(saveBook(data))
  close()
  emit('finish', data)
}

const open = async (id = 0) => {
  formRef.value?.resetFields()
  form.id = id
  form.coverUrl = ''
  visible.value = true
  if (id) {
    const book = await run(getBookById(id))
    book.formats = book.formats.split('/')
    book.tags = book.tags.map((x: any) => x.name)


    Object.assign(form, book)
  }
}

const close = () => {
  visible.value = false
}

defineExpose({ open })
</script>

<template>
  <Drawer :title="form.id ? '编辑图书' : '新增图书'" :width="720" :visible="visible" @close="close">
    <Spin :spinning="loading">
      <Form ref="formRef" :model="form" :rules="rules" layout="vertical" @finish="handleSubmit">
        <Form.Item name="cover" style="text-align: center">
          <Upload list-type="picture-card" class="cover-uploader" action="//upload.qiniup.com" name="file"
            :show-upload-list="false" :data="{ token: qiniuToken }" :before-upload="beforeUpload"
            @change="handleUpload">
            <img v-if="form.coverUrl" :src="form.coverUrl" />
            <div v-else>
              <LoadingOutlined v-if="uploading"></LoadingOutlined>
              <PlusOutlined v-else></PlusOutlined>
              <div class="ant-upload-text">上传封面</div>
            </div>
          </Upload>
        </Form.Item>
        <Row>
          <Col :span="24">
          <Form.Item label="标题" name="title">
            <Input v-model:value="form.title" />
          </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col :span="24">
          <Form.Item label="子标题" name="subtitle">
            <Input v-model:value="form.subtitle" />
          </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col :span="24">
          <Form.Item label="官方链接" name="orgUrl">
            <Input v-model:value="form.orgUrl" />
          </Form.Item>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="12">
          <Form.Item label="作者" name="author">
            <Input v-model:value="form.author" />
          </Form.Item>
          </Col>
          <Col :span="12">
          <Form.Item label="出版年月" name="pubDate">
            <DatePicker picker="month" v-model:value="form.pubDate" value-format="YYYY-MM-01" style="width: 100%" />
          </Form.Item>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="12">
          <Form.Item label="标签" name="tags">
            <Select v-model:value="form.tags" mode="tags" :options="tagOptions" :allow-clear="true" showSearch />
          </Form.Item>
          </Col>
          <Col :span="12">
          <Form.Item label="文件格式" name="formats">
            <Select v-model:value="form.formats" mode="multiple" :options="formatOptions" />
          </Form.Item>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="12">
          <Form.Item label="下载链接" name="fetchUrl">
            <Input v-model:value="form.fetchUrl" />
          </Form.Item>
          </Col>
          <Col :span="12">
          <Form.Item label="提取码" name="fetchCode">
            <Input v-model:value="form.fetchCode" />
          </Form.Item>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="12">
          <Form.Item label="书籍分类" name="categoryId">

            <Select v-model:value="form.categoryId" placeholder="请选择分类" :allow-clear="true" showSearch>
              <Select.Option disabled selected value="0" :key="0">请选择您的分类</Select.Option>
              <Select.Option :value="item.value" v-for="item in categoryOptions" :key="item.id">
                {{ item.label }}
              </Select.Option>
            </Select>

          </Form.Item>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="24">
          <Form.Item label="介绍" name="intro">
            <!-- <Input.TextArea v-model:value="form.intro" :rows="8" placeholder="" /> -->
            <IntroEditor v-model="form.intro" />
          </Form.Item>
          </Col>
        </Row>
        <div class="drawer-footer">
          <Button style="margin-right: 10px" @click="close">取消</Button>
          <Button type="primary" html-type="submit">提交</Button>
        </div>
      </Form>
    </Spin>
  </Drawer>
</template>

<style lang="less" scoped>
.drawer-footer {
  // position: fixed;
  // right: 0;
  // bottom: 0;
  // width: 100%;
  // border-top: 1px solid #e9e9e9;
  // padding: 10px 16px;
  text-align: center;
  background: #fff;
  z-index: 1;
}
</style>

<style lang="less">
.cover-uploader {
  display: flex;
  justify-content: center;

  .ant-upload,
  img {
    height: 200px;
    min-width: 150px;
  }

  .ant-upload-select-picture-card {
    margin: 0 auto;

    .anticon {
      font-size: 32px;
      color: #999;
    }

    .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }
  }
}
</style>
