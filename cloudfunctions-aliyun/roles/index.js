'use strict';
const db = uniCloud.database();
const _ = db.command
var code,
	msg,
	data
const admin = require('admin')
exports.main = async (event, context) => {
	// 核对token
	var payload = await admin.checkToken(event.uniIdToken)
	if (payload.code && payload.code > 0) {
		return payload
	}
	let params = event.params
	const collection = db.collection('roles')
	switch (event.method) {
		// 查询角色列表
		case 'GET':
			var page = params.page ? params.page : 1,
				pageSize = params.pageSize ? params.pageSize : 99999,
				search = {
					name: params.search ? new RegExp(params.search) : _.exists(true)
				},
				total = (await collection.where(search).count()).total,
				res = (await collection.aggregate()
					.lookup({
						from: 'admin',
						localField: '_id',
						foreignField: 'roles_id',
						as: 'user'
					})
					.project({
						name: 1,
						node: 1,
						status: true,
						user: 1
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
			await collection.add(params);
			code = 0
			msg = '新增成功'
			break;
		case 'EDIT':
			var id = params._id
			delete params._id;
			await collection.doc(id).update(params);
			code = 0
			msg = '编辑成功'
			break;
		case 'DELETE':
			var res = await db.collection('admin').where({
				roles_id: params.id
			}).count()
			if (res.total > 0) {
				return {
					code: 204,
					msg: '存在关联信息，请处理妥当再操作'
				};
			}
			await collection.doc(params.id).remove();
			code = 0
			msg = '删除成功'
			break;
		case 'BATCHDELETE':
			for (var item of params.ids) {
				const data = await db.collection('admin').where({
					roles_id: item
				}).count()
				if (data.total > 0) {
					return {
						code: 204,
						msg: '存在关联信息，请处理妥当再操作'
					};
				}
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
