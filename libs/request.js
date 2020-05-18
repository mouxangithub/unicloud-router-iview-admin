import {
	Message
} from 'view-design';
export default function(obj) {
	return new Promise((resolve, rejects) => {
		uniCloud.callFunction({
			name: obj.url,
			data: Object.assign(obj.data, {
				method: obj.method
			}),
			success(res) {
				if (res.success) {
					var data = res.result
					if (data.code == 200) {
						resolve(data.data)
					} else {
						Message.error(data.msg);
						reject()
					}
				} else {
					Message.error('服务器异常');
				}
			},
			fail(error) {
				Message.error('服务器异常');
			}
		})
	})
}
