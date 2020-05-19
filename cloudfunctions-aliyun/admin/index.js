'use strict';
var md5 = require('md5-node');
const db = uniCloud.database()
const _ = db.command
var code,
	msg,
	data
exports.main = async (event, context) => {
	const collection = db.collection('admin')
	switch (event.method) {
		// 查询角色列表
		case 'GET':
			var page = event.page ? event.page : 1,
				pageSize = event.pageSize ? event.pageSize : 99999,
				search = {
					roles_id: event.rolesid ? event.rolesid : _.exists(true),
					username: event.username ? new RegExp(event.username) : _.exists(true)
				},
				total = (await collection.where(search).count()).total,
				res = (await collection.aggregate()
					.lookup({
						from: 'roles',
						localField: 'roles_id',
						foreignField: '_id',
						as: 'roles'
					})
					.project({
						password: 0
					})
					.match(search)
					.skip((page - 1) * pageSize)
					.limit(pageSize)
					.end()).data;
			code = 200
			msg = 'success'
			data = {
				total,
				page,
				pageSize,
				data: res
			}
			break;
		case 'GETONE':
			data = (await collection.doc(event.id).get()).data[0];
			code = 200
			msg = 'success'
			break;
			// 添加角色
		case 'POST':
			delete event.method;
			if (event._id) {
				delete event._id;
			}
			event.password = md5(event.password)
			await collection.add(event);
			code = 200
			msg = '新增成功'
			break;
		case 'EDIT':
			delete event.method;
			var id = event._id
			var res = await collection.doc(id).get();
			if (event.password != res.data[0].password) {
				event.password = md5(event.password)
			}
			delete event._id;
			await collection.doc(id).update(event);
			code = 200
			msg = '编辑成功'
			break;
		case 'DELETE':
			await collection.doc(event.id).remove();
			code = 200
			msg = '删除成功'
			break;
		case 'BATCHDELETE':
			for (var item of event.ids) {
				await collection.doc(item).remove();
			}
			code = 200
			msg = '删除成功'
			break;
		case 'getAdminUserInfo':
			var res = await collection.aggregate()
			data = (await collection.aggregate()
				// 关联权限表
				.lookup({
					from: 'roles',
					localField: 'roles_id',
					foreignField: '_id',
					as: 'access'
				})
				// 判断权限
				.match({
					_id: event.userId,
					status: 1,
					'access.status': 1
				})
				.project({
					password: 0,
					roles_id: 0,
					status: 0
				})
				.end()).data[0];
			if (!data) {
				return {
					code: 404,
					msg: '您没有权限'
				}
			}
			msg = 'success';
			code = 200
			break;
		default:
			var code = '404',
				msg = '请求方式错误: Request mode error';
			break;
	};
	return {
		code,
		msg,
		data
	}
};
