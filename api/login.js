import {
	post,
	get,
	deleted
} from '@/libs/axios'

// 登录
export const login = data => post("login/index", data)

// 退出登录
export const logout = params => get("login/logout", params)

// 获取用户信息
export const getAdminUserInfo = params => get("user/userInfo", params)

// 获取小程序二维码
export const getcode = params => get("login/code", params)

// 到时删除code
export const decode = params => deleted("login/code", params)
