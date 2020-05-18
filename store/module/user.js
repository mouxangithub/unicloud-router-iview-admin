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
			return new Promise((resolve, reject) => {
				login({
					username,
					password
				}).then(async res => {
					commit('setUserId', res)
					var res = await dispatch('getUserInfo')
					if (res) {
						Notice.success({ title: '登录成功' });
						router.replace({ name: 'index' });
						return resolve(true)
					} else {
						return Message.error({
							background: true,
							content: res
						})
					}
				})
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
			return new Promise((resolve, reject) => {
				try {
					getAdminUserInfo(state.userId).then(res => {
						commit('setUserInfo', res)
						commit('setAccess', res.access[0].node)
						commit('setHasGetInfo', res ? true : false)
						resolve(res.access[0].node)
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		}
	}
}
