import {
	post,
	get,
	deleted,
	put
} from '@/libs/axios'

export const getRolesList = data => get("roles/index", data)

export const deleteRoles = data => deleted("roles/index", data)

export const getRoles = data => get("roles/index", data)

export const batchdelete = data => deleted("roles/index", data)

export const addRoles = data => post("roles/index", data)

export const editRoles = data => put("roles/index", data)
