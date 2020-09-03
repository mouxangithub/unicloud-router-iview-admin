import axios from 'axios-unicloud'
import {
	Message
} from 'view-design';
import store from '../store';
import router from '@/router'

// 配置基础函数（该项目使用为单一云函数，所以封装方式为基础云函数）
axios.defaults.baseCloud = 'api'

//添加请求拦截器
axios.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

//添加响应拦截器
axios.interceptors.response.use(
	(res) => {
		var data = res.data
		if (data.code === 0) {
			if (data.token) {
				store.commit('setToken', data.token)
			}
			if (data.data) {
				return Promise.resolve(data.data);
			} else {
				return Promise.resolve(data);
			}
		} else if (data.code === 1302) {
			store.dispatch('handleLogOut')
			return Promise.reject();
		} else if (data.code === 505) {
			store.commit('setUid', '')
			store.commit('setToken', '')
			store.commit('setHasGetInfo', '')
			router.replace({
				name: 'login'
			});
			Message.error({
				background: true,
				content: data.msg
			})
			return Promise.reject();
		} else {
			Message.error({
				background: true,
				content: data.msg
			})
			return Promise.reject();
		}
	},
	(error) => {
		return Promise.reject(error);
	}
);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params) {
	return new Promise((resolve, reject) => {
		axios
			.get(url, {
				params
			})
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data) {
	return new Promise((resolve, reject) => {
		axios
			.post(url, data)
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data) {
	return new Promise((resolve, reject) => {
		axios.patch(url, data)
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data) {
	return new Promise((resolve, reject) => {
		axios.put(url, data)
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function deleted(url, params) {
	return new Promise((resolve, reject) => {
		axios.delete(url, {
				params
			})
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}
