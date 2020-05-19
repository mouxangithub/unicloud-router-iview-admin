import {
	Message
} from 'view-design';
export default function(obj) {
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({
			name: obj.url,
			data: Object.assign(obj.data, {
				method: obj.method
			}),
			success(res) {
				var data = res.result
				if (data.code == 200) {
					resolve(data.data)
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
