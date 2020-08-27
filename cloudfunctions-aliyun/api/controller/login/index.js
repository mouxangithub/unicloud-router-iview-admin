const admin = require('../../libs/index')
exports.main = async (event, context) => {
	let {
		data
	} = event;
	return await admin.login({
		...data,
		queryField: ['username']
	});
}
