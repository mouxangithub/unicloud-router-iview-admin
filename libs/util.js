import {
	forEach,
	hasOneOf,
	objEqual
} from '@/libs/tools'
import config from '@/config'
const {
	title,
	useI18n,
	storageExpires
} = config

export const setUseInfoStorage = (data) => {
	var timestamp = Date.parse(new Date()); //当前时间
	var expiration = timestamp + storageExpires; // 缓存设置时间
	uni.setStorageSync('useInfoStorageTime', expiration);
	uni.setStorageSync('UserInfo', data);
}

export const getUseInfoStorage = () => {
	var timestamp = Date.parse(new Date()); //当前时间
	var expiration = timestamp + storageExpires; // 缓存设置时间
	var useInfoStorageTime = uni.getStorageSync("useInfoStorageTime");
	if (useInfoStorageTime) {
		if (timestamp < useInfoStorageTime) {
			const UserInfo = uni.getStorageSync('UserInfo');
			if (UserInfo) {
				return UserInfo;
			}
		}
	}
	removeUseInfoStorage()
	return false
}

export const removeUseInfoStorage = () => {
	uni.removeStorageSync('UserInfo');
}

export const hasChild = (item) => {
	return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
	if (item.meta && item.meta.access && item.meta.access.length) {
		if (hasOneOf(item.meta.access, access)) return true
		else return false
	} else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
	let res = []
	forEach(list, item => {
		if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
			let obj = {
				icon: (item.meta && item.meta.icon) || '',
				name: item.name,
				meta: item.meta
			}
			if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
				obj.children = getMenuByRouter(item.children, access)
			}
			if (item.menugroup) obj.menugroup = item.menugroup
			if (item.meta && item.meta.href) obj.href = item.meta.href
			if (showThisMenuEle(item, access)) res.push(obj)
		}
	})
	return res
}

/**
 * @param {Array} 
 *         list 通过路由列表得到权限列表
 *         useraccess，
 *         checked 是否全选
 *         expand 是否展开全部
 * @returns {Array}
 */
export const getAuthByRouter = (list, useraccess) => {
	let auth = []
	forEach(list, res => {
		var obj = {
			expand: true,
		};
		// 如果没有子路由并且access存在
		if (!res.children && res.meta.access) {
			obj.title = res.meta.title;
			obj.access = res.meta.access;
			useraccess ? (obj.checked = arrayEqual(useraccess, res.meta.access)) : false
		}
		// 多个子路由
		else if (res.children && res.children.length > 1) {
			// 获取下一级子路由信息
			var childrens = getAuthByRouter(res.children, useraccess)
			// 如果只有一个配置权限节点则直接替代父级
			if (childrens.length == 1) {
				if (childrens[0].access) {
					obj.title = childrens[0].title
					obj.access = childrens[0].access
					childrens[0].children ? (obj.children = getAuthByRouter(childrens[0].children, useraccess)) : null
					useraccess ? (obj.checked = arrayEqual(useraccess, childrens[0].access)) : false
				} else obj = null
			} else {
				obj.title = res.meta.title
				if (res.meta.access) {
					obj.access = res.meta.access
					useraccess ? (obj.checked = arrayEqual(useraccess, res.meta.access)) : false
				}
				if (childrens.length > 1) {
					obj.children = childrens
				} else {
					obj = null
				}
			}
		}
		// 子路由一个
		else if (res.children && res.children.length == 1) {
			const ca = res.children[0].meta.access;
			const ma = res.meta.access;
			// 子路由和父级路由权限都存在，显示父级
			if (ca && ma || !ca && ma) {
				obj.title = res.meta.title
				obj.access = res.meta.access
				res.children ? (obj.children = getAuthByRouter(res.children, useraccess)) : null
				useraccess ? (obj.checked = arrayEqual(useraccess, ma)) : false
			}
			// 子路由权限存在，父级不存在，显示子路由，取代父级
			else if (ca && !ma) {
				obj.title = res.children[0].meta.title;
				obj.access = res.children[0].meta.access;
				res.children[0].children ? (obj.children = getAuthByRouter(res.children[0].children, useraccess)) : null
				useraccess ? (obj.checked = arrayEqual(useraccess, ca)) : false
			} else obj = null
		} else obj = null;
		// 组合数组
		obj ? auth.push(obj) : null;
	})
	return auth
}

/**
 * 获取对应账号的路由，及自动匹配路由
 * @param {Array} 
 *         list 通过路由列表得到权限列表
 *         useraccess
 *         checked 是否全选
 *         expand 是否展开全部
 *         myaccess 父级权限
 * 新增：分配子权限
 */
export const getSubRouter = (list, useraccess, myaccess) => {
	let auth = []
	forEach(list, res => {
		var obj = {
			expand: true,
		};
		// 如果没有子路由并且access存在
		if (!res.children && res.meta.access && arrayEqual(myaccess, res.meta.access)) {
			obj.title = res.meta.title;
			obj.access = res.meta.access;
			obj.checked = useraccess ? arrayEqual(useraccess, res.meta.access) : false
		}
		// 多个子路由
		else if (res.children && res.children.length > 1) {
			// 获取下一级子路由信息
			var childrens = getSubRouter(res.children, useraccess, myaccess)
			// 如果只有一个配置权限节点则直接替代父级
			if (childrens.length == 1) {
				if (childrens[0].access && arrayEqual(myaccess, childrens[0].access)) {
					obj.title = childrens[0].title
					obj.access = childrens[0].access
					obj.children = childrens[0].children ? getSubRouter(childrens[0].children, useraccess, myaccess) : null
					obj.checked = useraccess ? arrayEqual(useraccess, childrens[0].access) : false
				} else obj = null
			} else {
				obj.title = res.meta.title
				if (res.meta.access && arrayEqual(myaccess, res.meta.access)) {
					obj.access = res.meta.access
					obj.checked = useraccess ? arrayEqual(useraccess, res.meta.access) : false
				}
				if (childrens.length > 1) {
					obj.children = childrens
				} else {
					obj = null
				}
			}
		}
		// 子路由一个
		else if (res.children && res.children.length == 1) {
			const ca = res.children[0].meta.access;
			const ma = res.meta.access;
			// 子路由和父级路由权限都存在，显示父级
			if (ca && ma && arrayEqual(myaccess, ma) || !ca && ma && arrayEqual(myaccess, ma)) {
				obj.title = res.meta.title
				obj.access = res.meta.access
				obj.children = res.children ? getSubRouter(res.children, useraccess, myaccess) : null
				obj.checked = useraccess ? arrayEqual(useraccess, ma) : false
			}
			// 子路由权限存在，父级不存在，显示子路由，取代父级
			else if (ca && !ma && arrayEqual(myaccess, res.children[0].meta.access)) {
				obj.title = res.children[0].meta.title;
				obj.access = res.children[0].meta.access;
				obj.children = res.children[0].children ? getSubRouter(res.children[0].children, useraccess, myaccess) : null
				obj.checked = useraccess ? arrayEqual(useraccess, ca) : false
			} else obj = null
		} else obj = null;
		// 组合数组
		obj ? auth.push(obj) : null;
	})
	return auth
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
	let homeItem = { ...homeRoute,
		icon: homeRoute.meta.icon
	}
	let routeMetched = route.matched
	if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
	let res = routeMetched.filter(item => {
		return item.meta === undefined || !item.meta.hideInBread
	}).map(item => {
		let meta = { ...item.meta
		}
		if (meta.title && typeof meta.title === 'function') {
			meta.__titleIsFunction__ = true
			meta.title = meta.title(route)
		}
		let obj = {
			icon: (item.meta && item.meta.icon) || '',
			name: item.name,
			meta: meta
		}
		return obj
	})
	res = res.filter(item => {
		return !item.meta.hideInMenu
	})
	return [{ ...homeItem,
		to: homeRoute.path
	}, ...res]
}

export const getRouteTitleHandled = (route) => {
	let router = { ...route
	}
	let meta = { ...route.meta
	}
	let title = ''
	if (meta.title) {
		if (typeof meta.title === 'function') {
			meta.__titleIsFunction__ = true
			title = meta.title(router)
		} else title = meta.title
	}
	meta.title = title
	router.meta = meta
	return router
}

export const showTitle = (item, vm) => {
	let {
		title,
		__titleIsFunction__
	} = item.meta
	if (!title) return
	if (useI18n) {
		if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str
			.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
		else if (__titleIsFunction__) title = item.meta.title
		else title = vm.$t(item.name)
	} else title = (item.meta && item.meta.title) || item.name
	return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
	localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
	const list = localStorage.tagNaveList
	return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为index的对象
 */
export const getHomeRoute = (routers, homeName = 'index') => {
	let i = -1
	let len = routers.length
	let homeRoute = {}
	while (++i < len) {
		let item = routers[i]
		if (item.children && item.children.length) {
			let res = getHomeRoute(item.children, homeName)
			if (res.name) return res
		} else {
			if (item.name === homeName) homeRoute = item
		}
	}
	return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
	const {
		name,
		path,
		meta
	} = newRoute
	let newList = [...list]
	if (newList.findIndex(item => item.name === name) >= 0) {
		return newList
	} else {
		newList.push({
			name,
			path,
			meta
		})
	}
	return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
	if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
	else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
	const routePermissionJudge = (list) => {
		return list.some(item => {
			if (item.children && item.children.length) {
				return routePermissionJudge(item.children)
			} else if (item.name === name) {
				return hasAccess(access, item)
			}
		})
	}

	return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
	const keyValueArr = url.split('?')[1].split('&')
	let paramObj = {}
	keyValueArr.forEach(item => {
		const keyValue = item.split('=')
		paramObj[keyValue[0]] = keyValue[1]
	})
	return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
	let res = {}
	if (list.length === 2) {
		res = getHomeRoute(list)
	} else {
		const index = list.findIndex(item => routeEqual(item, route))
		if (index === list.length - 1) res = list[list.length - 2]
		else res = list[index + 1]
	}
	return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
	let i = -1
	while (++i < times) {
		callback(i)
	}
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
	let nameSplit = file.name.split('.')
	let format = nameSplit[nameSplit.length - 1]
	return new Promise((resolve, reject) => {
		let reader = new FileReader()
		reader.readAsText(file) // 以文本格式读取
		let arr = []
		reader.onload = function(evt) {
			let data = evt.target.result // 读到的数据
			let pasteData = data.trim()
			arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
				return row.split('\t')
			}).map(item => {
				return item[0].split(',')
			})
			if (format === 'csv') resolve(arr)
			else reject(new Error('[Format Error]:你上传的不是Csv文件'))
		}
	})
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
	let columns = []
	let tableData = []
	if (array.length > 1) {
		let titles = array.shift()
		columns = titles.map(item => {
			return {
				title: item,
				key: item
			}
		})
		tableData = array.map(item => {
			let res = {}
			item.forEach((col, i) => {
				res[titles[i]] = col
			})
			return res
		})
	}
	return {
		columns,
		tableData
	}
}

export const findNodeUpper = (ele, tag) => {
	if (ele.parentNode) {
		if (ele.parentNode.tagName === tag.toUpperCase()) {
			return ele.parentNode
		} else {
			return findNodeUpper(ele.parentNode, tag)
		}
	}
}

export const findNodeUpperByClasses = (ele, classes) => {
	let parentNode = ele.parentNode
	if (parentNode) {
		let classList = parentNode.classList
		if (classList && classes.every(className => classList.contains(className))) {
			return parentNode
		} else {
			return findNodeUpperByClasses(parentNode, classes)
		}
	}
}

export const findNodeDownward = (ele, tag) => {
	const tagName = tag.toUpperCase()
	if (ele.childNodes.length) {
		let i = -1
		let len = ele.childNodes.length
		while (++i < len) {
			let child = ele.childNodes[i]
			if (child.tagName === tagName) return child
			else return findNodeDownward(child, tag)
		}
	}
}

export const showByAccess = (access, canViewAccess) => {
	return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
	return route1.name === route2.name
}

/**
 * 判断两个数组是否存在相同的值
 */
export const arrayEqual = (arr1, arr2) => {
	var arr3 = new Array();
	var c = arr2.toString();
	for (var i = 0; i < arr1.length; i++) {
		if (c.indexOf(arr1[i].toString()) > -1) {
			for (var j = 0; j < arr2.length; j++) {
				if (arr1[i] == arr2[j]) {
					arr3.push(arr1[i])
				}
			}
		}
	}
	return arr3.length > 0 ? true : false
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
	let len = tagNavList.length
	let res = false
	doCustomTimes(len, (index) => {
		// console.log(tagNavList[index].name)
		if (routeEqual(tagNavList[index], routeItem)) res = true
	})
	return res
}

export const localSave = (key, value) => {
	localStorage.setItem(key, value)
}

export const localRead = (key) => {
	return localStorage.getItem(key) || ''
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = (
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
				return window.setTimeout(callback, 1000 / 60)
			}
		)
	}
	const difference = Math.abs(from - to)
	const step = Math.ceil(difference / duration * 50)

	const scroll = (start, end, step) => {
		if (start === end) {
			endCallback && endCallback()
			return
		}

		let d = (start + step > end) ? end : start + step
		if (start > end) {
			d = (start - step < end) ? end : start - step
		}

		if (el === window) {
			window.scrollTo(d, d)
		} else {
			el.scrollTop = d
		}
		window.requestAnimationFrame(() => scroll(d, end, step))
	}
	scroll(from, to, step)
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
	const handledRoute = getRouteTitleHandled(routeItem)
	const pageTitle = showTitle(handledRoute, vm)
	const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
	window.document.title = resTitle
}
