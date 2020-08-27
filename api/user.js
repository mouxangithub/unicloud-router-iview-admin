import {
	post,
	get,
	deleted,
	put
} from '@/libs/axios'

export const getAdminUserList = data => get("user/index", data)

export const deleteAdminUser = data => deleted("user/index", data)

export const getAdminUser = data => get("user/index", data)

export const batchdelete = data => deleted("user/index", data)

export const addAdminUser = data => post("user/index", data)

export const editAdminUser = data => put("user/index", data)