const admin = require('../../libs/index')
module.exports = {
	main: async (event) => {
		let {
			data,
			token,
			method
		} = event;
		try {
			var res = await admin.logout(token)
			if (res.code === 0) {
				return res
			} else {
				throw res
			}
		} catch (err) {
			return {
				code: 505,
				msg: 'Token状态异常'
			}
		}
	}
}
