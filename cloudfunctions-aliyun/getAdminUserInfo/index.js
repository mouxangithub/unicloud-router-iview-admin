'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate
exports.main = async (event, context) => {
	return db.collection('admin').aggregate()
		.lookup({
			from: 'roles',
			localField: 'roles',
			foreignField: '_id',
			as: 'access'
		})
		.match({
			_id: event.userId,
			status: 1,
			'access.status': 1
		})
		.end();
};
