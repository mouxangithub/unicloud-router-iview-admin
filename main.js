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

Vue.config.productionTip = false
Vue.prototype.$config = config

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})

RouterMount(app,'#app');
