import {
	Message
} from 'view-design';
import store from '../store';
import router from '@/router'
export default function(obj) {
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({
			name: 'api',
			data: {
				url: obj.url,
				method: obj.method,
				data: obj.data
			},
			success(res) {
				var data = res.result
				if (data.code === 0) {
					if (data.token) {
						resolve(data)
					} else {
						resolve(data.data)
					}
				} else if (data.code === 1302) {
					store.dispatch('handleLogOut')
				} else if (data.code === 505) {
					store.commit('setUid', '')
					store.commit('setToken', '')
					store.commit('setHasGetInfo', '')
					router.replace({
						name: 'login'
					});
					Message.error({
						background: true,
						content: data.msg
					})
				} else {
					Message.error({
						background: true,
						content: data.msg
					})
					reject()
				}
			},
			fail(error) {
				reject(Message.error('服务器异常'))
			}
		})
	})
}
