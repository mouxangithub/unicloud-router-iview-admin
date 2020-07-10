import request from '@/libs/request'

// 登录
export const login = (data) => {
	return request({
		url: 'adminLogin',
		method: 'login',
		data
	})
}

// 退出登录
export const logout = (data) => {
	return request({
		url: 'adminLogin',
		method: 'logout',
		data
	})
}

// 获取用户信息
export const getAdminUserInfo = (data) => {
	return request({
		url: 'adminLogin',
		method: 'getAdminUserInfo',
		data
	})
}
