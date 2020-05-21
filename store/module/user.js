import {
	getUseInfoStorage,
	setUseInfoStorage,
	removeUseInfoStorage
} from '@/libs/util';
import {
	login,
	getAdminUserInfo
} from '@/api/user'
import {
	Message,
	Notice
} from 'view-design';
import router from '@/router'

export default {
	state: {
		userId: getUseInfoStorage() ? getUseInfoStorage()._id : '',
		UseInfo: getUseInfoStorage() || '',
		access: getUseInfoStorage() ? getUseInfoStorage().access[0].node : '',
		hasGetInfo: getUseInfoStorage() ? true : false
	},
	mutations: {
		setUserId(state, id) {
			state.userId = id
			uni.setStorageSync('UserId', id);
		},
		setAccess(state, access) {
			state.access = access
		},
		setUserInfo(state, UseInfo) {
			state.UseInfo = UseInfo
			setUseInfoStorage(UseInfo)
		},
		setHasGetInfo(state, status) {
			state.hasGetInfo = status
		}
	},
	getters: {},
	actions: {
		// 登录
		handleLogin({
			dispatch,
			commit
		}, {
			username,
			password
		}) {
			username = username.trim()
			return new Promise(async (resolve, reject) => {
				try {
					var res = await login({
						username,
						password
					})
					commit('setUserId', res)
					await dispatch('getUserInfo')
					Notice.success({
						title: '登录成功'
					});
					router.replace({
						name: 'index'
					});
					return resolve(true)
				} catch (error) {
					reject(error)
				}
			})
		},
		// 退出登录
		handleLogOut() {
			return new Promise((resolve, reject) => {
				removeUseInfoStorage()
				resolve()
			})
		},
		// 获取用户相关信息
		getUserInfo({
			state,
			commit
		}) {
			return new Promise(async (resolve, reject) => {
				try {
					var res = await getAdminUserInfo(state.userId)
					commit('setUserInfo', res)
					commit('setAccess', res.access[0].node)
					commit('setHasGetInfo', res ? true : false)
					resolve(res.access[0].node)
				} catch (error) {
					reject(error)
				}
			})
		}
	}
}
