/**
 * 表单核验
 */
export const validateUse = (rule, value, callback) => {
	if (!value) {
		callback(new Error('请输入账号'));
	} else {
		if (!checker('username', value)) {
			callback(new Error('请输入合法的账号'));
		}
		callback();
	}
};
export const validatePass = (rule, value, callback) => {
	if (!value) {
		callback(new Error('请输入密码'));
	} else {
		if (!checker('password', value)) {
			callback(new Error('密码最少六位，且开头需为字母'));
		}
		callback();
	}
};
export const validateEmail = (rule, value, callback) => {
	if (!value) {
		callback(new Error('请输入邮箱'));
	} else {
		if (!checker('email', value)) {
			callback(new Error('请输入合法邮箱'));
		}
		callback();
	}
};
/**
 * 正则表达式
 */
export default function checker(type, value) {
	switch (type) {
		// 用户名
		case 'username':
			var pattern = /^[-_a-zA-Z0-9]{5,16}$/;
			return pattern.test(value);
			break;
			// 密码
		case 'password':
			var pattern = /(?=.*[A-Za-z])[A-Za-z\d$@!%*#?&]{6,16}$/;
			return pattern.test(value);
			break;
			// 邮箱
		case 'email':
			var pattern = /^[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}$/;
			return pattern.test(value);
			break;
	}
}
