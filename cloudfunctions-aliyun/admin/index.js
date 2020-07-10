'use strict';
const admin = require('admin')
const db = uniCloud.database()
const _ = db.command
var code,
	msg,
	data
exports.main = async (event, context) => {
	// 核对token
	let payload = {}
	payload = await admin.checkToken(event.uniIdToken)
	if (payload.code && payload.code > 0) {
		return payload
	}
	let params = event.params
	const collection = db.collection('admin')
	switch (event.method) {
		// 查询角色列表
		case 'GET':
			var page = params.page ? params.page : 1,
				pageSize = params.pageSize ? params.pageSize : 99999,
				search = {
					roles_id: params.rolesid ? params.rolesid : _.exists(true),
					username: params.username ? new RegExp(params.username) : _.exists(true)
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
			code = 0
			msg = 'success'
			data = {
				total,
				page,
				pageSize,
				data: res
			}
			break;
		case 'GETONE':
			data = (await collection.doc(params.id).get()).data[0];
			code = 0
			msg = 'success'
			break;
			// 添加角色
		case 'POST':
			if (params._id) {
				delete params._id;
			}
			params.password = admin.encryptPwd(params.password)
			await collection.add(params);
			code = 0
			msg = '新增成功'
			break;
		case 'EDIT':
			var id = params._id
			delete params._id;
			var res = await collection.doc(id).get();
			if (admin.encryptPwd(params.password) != res.data[0].password) {
				params.password = admin.encryptPwd(params.password)
			}
			await collection.doc(id).update(params);
			code = 0
			msg = '编辑成功'
			break;
		case 'DELETE':
			await collection.doc(params.id).remove();
			code = 0
			msg = '删除成功'
			break;
		case 'BATCHDELETE':
			for (var item of params.ids) {
				await collection.doc(item).remove();
			}
			code = 0
			msg = '删除成功'
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
