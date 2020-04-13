'use strict';
/**
 * 登录函数
 */
const db = uniCloud.database();
exports.main = async (event, context) => {
	const collection = db.collection('admin');
	var res = await collection.where({
		username: event.username
	}).get();
	if (res.affectedDocs < 1) {
		return {
			code: 1000,
			status: 'error',
			msg: '该账户不存在'
		};
	}
	var user = res.data[0];
	if (user.password != event.password) {
		return {
			code: 1001,
			status: 'error',
			msg: '密码错误'
		};
	}
	if (user.status != 1) {
		return {
			code: 1002,
			status: 'error',
			msg: '该账号异常，请联系管理'
		};
	}
	return {
		code: 200,
		status: 'success',
		data: user._id
	};
};
