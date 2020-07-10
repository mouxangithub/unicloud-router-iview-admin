import Layout from '@/layout/index'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * menugroup：MenuGroup分组，详情请查看iview官网：https://www.iviewui.com/components/menu
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由，为方便鉴别权限，请使用不同命名的access
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
export default [{
		path: '/login',
		component: () => import('@/view/login/login.vue'),
		name: 'login',
		meta: {
			title: '用户登录',
			hideInMenu: true,
			hideInBread: true
		}
	},
	{
		path: '/',
		name: '_index',
		component: Layout,
		redirect: '/index',
		meta: {
			title: '首页',
			hideInMenu: true,
			icon: 'md-home'
		},
		children: [{
			path: 'index',
			name: 'index',
			meta: {
				title: '首页',
				icon: 'md-home'
			},
			component: () => import('@/view/index/index')
		}]
	},
	{
		path: '/user',
		component: Layout,
		name: '/user/index',
		redirect: '/index',
		meta: {
			title: '用户管理',
			icon: 'md-nuclear'
		},
		children: [{
			path: 'index',
			name: 'user',
			meta: {
				access: ['user'],
				title: '用户管理',
				icon: 'ios-people'
			},
			component: () => import('@/view/user/index')
		}, {
			path: 'roles',
			name: 'roles',
			meta: {
				access: ['roles'],
				title: '角色管理',
				icon: 'ios-aperture'
			},
			component: () => import('@/view/user/roles')
		}]
	},
	{
		path: '/401',
		name: 'error_401',
		meta: {
			hideInMenu: true
		},
		component: () => import('@/view/error-page/401.vue')
	},
	{
		path: '/500',
		name: 'error_500',
		meta: {
			hideInMenu: true
		},
		component: () => import('@/view/error-page/500.vue')
	},
	{
		path: '*',
		name: 'error_404',
		meta: {
			hideInMenu: true
		},
		component: () => import('@/view/error-page/404.vue')
	},
	{
		path: '/uni',
		name: 'uni',
		menugroup: true,
		meta: {
			title: '友情链接',
			icon: 'ios-book',
		},
		children: [{
			path: 'uni-simple-router',
			name: 'uni-simple-router',
			meta: {
				title: 'uni-simple-router',
				href: 'http://hhyang.cn',
				icon: 'ios-book'
			}
		}, {
			path: 'uniapp',
			name: 'uniapp',
			meta: {
				title: 'uniapp',
				href: 'https://uniapp.dcloud.io/',
				icon: 'ios-book'
			}
		}, {
			path: 'iView-admin2.0',
			name: 'iView-admin2.0',
			meta: {
				title: 'iView-admin2.0',
				href: 'https://lison16.github.io/iview-admin-doc/#/',
				icon: 'ios-book'
			}
		}, {
			path: 'iView',
			name: 'iView',
			meta: {
				title: 'iView',
				href: 'https://www.iviewui.com/',
				icon: 'ios-book'
			}
		}]
	}
]
