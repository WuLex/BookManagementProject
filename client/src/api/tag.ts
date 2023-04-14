import http from '../utils/http'

//请求http://localhost:3000/api/tags,由于vite.config.ts开启了代理,会转发请求到后端
export const getTags = (params?: object) => http.get(`tags`, params)

// export const getTagById = (id: number) => http.get(`tags/${id}`)

export const saveTag = (data: object) => http.post(`tags`, data)

export const deleteTag = (id: number) => http.delete(`tags/${id}`)
