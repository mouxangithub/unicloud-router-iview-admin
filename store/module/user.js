import {
	getUseInfoStorage,
	setUseInfoStorage,
	removeUseInfoStorage
} from '@/libs/util';

export default {
	state: {
		username: getUseInfoStorage() ? getUseInfoStorage().username : '',
		userId: getUseInfoStorage() ? getUseInfoStorage()._id : '',
		avatarImgPath: getUseInfoStorage() ? getUseInfoStorage().avatar : '',
		UseInfo: getUseInfoStorage() || '',
		access: getUseInfoStorage() ? getUseInfoStorage().access[0].node : '',
		hasGetInfo: getUseInfoStorage() ? true : false
	},
	mutations: {
		setAvatar(state, avatarPath) {
			state.avatarImgPath = avatarPath
		},
		setUserId(state, id) {
			state.userId = id
			uni.setStorageSync('UserId', id);
		},
		setUserName(state, name) {
			state.username = name
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
		},
	},
	getters: {},
	actions: {
		// 登录
		handleLogin({
			commit
		}, {
			username,
			password
		}) {
			username = username.trim()
			return new Promise((resolve, rejects) => {
				uniCloud.callFunction({
					name: 'login',
					data: {
						username,
						password
					},
					success(res) {
						if (res.result.code == 200) {
							commit('setUserId', res.result.data)
							resolve()
						} else {
							rejects(res.result.msg)
						}
					},
					fail(res) {
						rejects(res)
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
			const userId = state.userId;
			return new Promise((resolve, reject) => {
				uniCloud.callFunction({
					name: 'getAdminUserInfo',
					data: {
						userId
					},
					success(res) {
						const data = res.result.data[0]
						commit('setUserInfo', data)
						commit('setAvatar', data.avatar)
						commit('setUserName', data.username)
						commit('setAccess', data.access[0].node)
						commit('setHasGetInfo', true)
						resolve(data.access[0].node)
					},
					fail(res) {
						reject(res)
					}
				})
			})
		}
	}
}
