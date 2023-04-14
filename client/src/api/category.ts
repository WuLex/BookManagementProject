import http from '../utils/http'


//请求http://localhost:3000/api/categorys?page=1&size=10000,由于vite.config.ts开启了代理,会转发请求到后端
export const getCategorys = (params?: object) => http.get(`categorys`, params)

// export const getCategoryById = (id: number) => http.get(`tags/${id}`)

export const saveCategory = (data: object) => http.post(`categorys`, data)

export const deleteCategory = (id: number) => http.delete(`categorys/${id}`)
