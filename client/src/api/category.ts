import http from '../utils/http'

export const getCategorys = (params?: object) => http.get(`categorys`, params)

// export const getCategoryById = (id: number) => http.get(`tags/${id}`)

export const saveCategory = (data: object) => http.post(`categorys`, data)

export const deleteCategory = (id: number) => http.delete(`categorys/${id}`)
