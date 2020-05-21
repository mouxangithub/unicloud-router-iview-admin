'use strict';
const db = uniCloud.database();
const _ = db.command
var code,
	msg,
	data
exports.main = async (event, context) => {
	const collection = db.collection('roles')
	switch (event.method) {
		// 查询角色列表
		case 'GET':
			var page = event.page ? event.page : 1,
				pageSize = event.pageSize ? event.pageSize : 99999,
				search = {
					name: event.search ? new RegExp(event.search) : _.exists(true)
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
			await collection.add(event);
			code = 200
			msg = '新增成功'
			break;
		case 'EDIT':
			delete event.method;
			var id = event._id
			delete event._id;
			await collection.doc(id).update(event);
			code = 200
			msg = '编辑成功'
			break;
		case 'DELETE':
			var res = await db.collection('admin').where({
				roles_id: event.id
			}).count()
			if (res.total > 0) {
				return {
					code: 204,
					msg: '存在关联信息，请处理妥当再操作'
				};
			}
			await collection.doc(event.id).remove();
			code = 200
			msg = '删除成功'
			break;
		case 'BATCHDELETE':
			for (var item of event.ids) {
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
			code = 200
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
