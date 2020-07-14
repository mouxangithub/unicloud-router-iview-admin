const admin = require('../../libs/index')
module.exports = {
	main: async (event) => {
		let {
			data,
			token,
			method
		} = event;
		return await admin.login({
			...data,
			queryField: ['username']
		});
	}
}
