import request from '@/libs/request'

// 登录
export const login = (data) => {
	return request({
		url: 'login/index',
		data
	})
}

// 退出登录
export const logout = (data) => {
	return request({
		url: 'login/logout',
		data
	})
}

// 获取用户信息
export const getAdminUserInfo = (data) => {
	return request({
		url: 'user/userInfo',
		data
	})
}
