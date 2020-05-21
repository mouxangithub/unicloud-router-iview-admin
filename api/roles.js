import request from '@/libs/request'
var url = 'roles'
export const getRolesList = (data) => {
	return request({
		url,
		method: 'GET',
		data
	})
}

export const deleteRoles = (data) => {
	return request({
		url,
		method: 'DELETE',
		data
	})
}

export const getRoles = (data) => {
	return request({
		url,
		method: 'GETONE',
		data
	})
}

export const batchdelete = (data) => {
	return request({
		url,
		method: 'BATCHDELETE',
		data
	})
}

export const addRoles = (data) => {
	return request({
		url,
		method: 'POST',
		data
	})
}

export const editRoles = (data) => {
	return request({
		url,
		method: 'EDIT',
		data
	})
}
