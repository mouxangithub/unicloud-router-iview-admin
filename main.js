import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import { RouterMount } from 'uni-simple-router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import store from '@/store';
import config from '@/config'
Vue.use(ViewUI);

Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

App.mpType = 'app'

const app = new Vue({
    ...App,
    store,
    render: h => h(App)
})
Vue.prototype.uniCloud = function(parm) {
	return new Promise((resolve, rejects) => {
		uniCloud.callFunction({
			name: parm.name,
			data: parm.data,
			success(res) {
				resolve(res.result)
			},
			fail(res) {
				rejects(res)
			}
		})
	})
};
// #ifdef H5
	RouterMount(app,'#app');
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
