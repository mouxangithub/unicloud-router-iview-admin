'use strict';
/**
 * 登录函数
 */
const admin = require('admin')
const db = uniCloud.database()
exports.main = async (event, context) => {
	let params = event.params
	switch (event.method) {
		// 登录
		case 'login':
			return await admin.login({
				...params,
				queryField: ['username']
			});
			break;
		case 'logout':
			try {
				var res = await admin.logout(event.uniIdToken)
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
			break;
		case 'getAdminUserInfo':
			const collection = db.collection('admin')
			var res = await collection.aggregate(),
				payload = await admin.checkToken(event.uniIdToken);
			if (payload.code && payload.code > 0) {
				return payload
			}
			var data = (await collection.aggregate()
				// 关联权限表
				.lookup({
					from: 'roles',
					localField: 'roles_id',
					foreignField: '_id',
					as: 'access'
				})
				// 判断权限
				.match({
					_id: payload.uid,
					status: 0,
					'access.status': 0
				})
				.project({
					password: 0,
					roles_id: 0,
					status: 0,
					token: 0
				})
				.end()).data[0];
			if (!data) {
				return {
					code: 404,
					msg: '您没有权限'
				}
			}
			return {
				msg: 'success',
				code: 0,
				data
			}
			break;
		case 'checkToken':
			return await admin.checkToken(event.uniIdToken)
			break;
		default:
			return {
				msg: '请求方式错误: Request mode error',
				code: 404
			}
			break;
	}
};
