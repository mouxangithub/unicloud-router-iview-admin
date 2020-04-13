/**
 * 正则表达式
 */
export default function(type,value) {
	switch (type) {
		// 用户名
		case 'username':
			var pattern = /^[-_a-zA-Z0-9]{4,16}$/;
			return pattern.test(value);
			break;
		// 密码
		case 'password':
			var pattern = /(?=.*[A-Z])||(?=.*[a-z])||(?=.*\d)||(?=.*[$@!%*#?&])||[A-Za-z\d$@!%*#?&]{6,16}$/;
			return pattern.test(value);
			break;
		// 学号
		case 'st_code':
			var pattern = /^[A-Za-z]\d{2}[A-Za-z]\d{4}$/;
			return pattern.test(value);
			break;
		// 邮箱
		case 'email':
			var pattern = /^[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}$/;
			return pattern.test(value);
			break;
	}
}
