const admin = require('../../libs/index')
const db = uniCloud.database()
const _ = db.command
module.exports = {
	main: async (event) => {
		let {
			data,
			token,
			method
		} = event;
		const collection = db.collection('admin')
		switch (method) {
			// 查询角色列表
			case 'GET':
				var page = data.page ? data.page : 1,
					pageSize = data.pageSize ? data.pageSize : 100,
					search = {
						roles_id: data.rolesid ? data.rolesid : _.exists(true),
						username: data.username ? new RegExp(data.username) : _.exists(true)
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
							password: 0,
							token: 0,
							last_login_date: 0,
							last_login_ip: 0,
							register_date: 0,
							register_ip: 0,
							'roles._id': 0,
							'roles.node': 0,
							'roles.status': 0
						})
						.match(search)
						.skip((page - 1) * pageSize)
						.limit(pageSize)
						.end()).data;
				return {
					code: 0,
					msg: 'success',
					data: {
						total,
						page,
						pageSize,
						data: res
					}
				}
				break;
			case 'GETONE':
				var res = (await collection.doc(data.id).get()).data[0]
				return {
					code: 0,
					msg: 'success',
					data: res
				}
				break;
				// 添加角色
			case 'POST':
				if (data._id) {
					delete data._id;
				}
				data.password = admin.encryptPwd(data.password)
				await collection.add(data);
				return {
					code: 0,
					msg: 'success'
				}
				break;
			case 'EDIT':
				var id = data._id
				delete data._id;
				var res = await collection.doc(id).get();
				if (admin.encryptPwd(data.password) != res.data[0].password) {
					data.password = admin.encryptPwd(data.password)
				}
				await collection.doc(id).update(data);
				return {
					code: 0,
					msg: 'success'
				}
				break;
			case 'DELETE':
				await collection.doc(data.id).remove();
				return {
					code: 0,
					msg: 'success'
				}
				break;
			case 'BATCHDELETE':
				for (var item of data.ids) {
					await collection.doc(item).remove();
				}
				return {
					code: 0,
					msg: 'success'
				}
				break;
			default:
				return {
					code: 404,
					msg: '请求方式错误: Request mode error'
				}
				break;
		};
	}
}
