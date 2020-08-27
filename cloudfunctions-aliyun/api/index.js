'use strict';
exports.main = async (event, context) => {
	let url = event.url;
	let data = event.data;
	let token = event.uniIdToken;
	let method = event.method;
	// 守卫拦截
	const before = require(__dirname + '/libs/before');
	let json = await before.main({
		url,
		token
	});
	if (json.code != 0) {
		return json;
	}
	// 加载业务函数
	let controller;
	try {
		controller = require(__dirname + '/controller/' + url); // __dirname是为了兼容阿里云
	} catch (err) {
		return err
		return {
			code: 404,
			msg: '请求错误: Request error',
		}
	}
	// 执行业务函数
	return await controller.main({
		data,
		token,
		method
	}, context);
};
