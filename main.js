import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import { RouterMount } from 'uni-simple-router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import store from '@/store';
import config from '@/config'
Vue.use(ViewUI);

ViewUI.Message.config({
	top: 50,
	duration: 3
});

ViewUI.Notice.config({
	top: 100,
	duration: 3
});

// 图片预览插件
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)

// 富文本
import Editor from './components/editor/editor'
import 'github-markdown-css/github-markdown.css';
Vue.component('Editor', Editor)

Vue.config.productionTip = false
Vue.prototype.$config = config

App.mpType = 'app'

const app = new Vue({
	...App,
	router,
	store
})

RouterMount(app,'#app');
