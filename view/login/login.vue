<template>
	<div class="page">
		<Form :model="loginForm" :rules="rules" ref="loginForm" class="login-form" @keydown.enter.native="login('loginForm')">
			<div @tap="changeMode" class="code">
				<image v-if="iscode" src="@/assets/images/code.png" style="width: 40px;height: 40px;" />
				<image v-else src="@/assets/images/login.png" style="width: 40px;height: 40px;" />
			</div>
			<h2 class="title">{{ iscode ? '用 户 登 录' : '扫 码 登 录' }}</h2>
			<div v-if="iscode" class="formlist">
				<FormItem prop="username"><Input type="text" v-model="loginForm.username" placeholder="用户名" autocomplete="off" prefix="ios-contact" /></FormItem>
				<FormItem prop="password">
					<Input :type="textType" v-model="loginForm.password" placeholder="密码" autocomplete="off" prefix="ios-lock" icon="ios-eye" @on-click="changeType" />
				</FormItem>
				<FormItem>
					<Button class="login-btn" :loading="loading" @click="login('loginForm')">
						<span>{{ loading ? 'Loading...' : '登 录' }}</span>
					</Button>
				</FormItem>
			</div>
			<div v-else class="formlist">
				<image v-if="!codeloading" style="width: 330px;height: 330px;" :src="codeimg" />
				<div v-if="codeloading" style="position: relative;width: 330px;height: 330px;">
					<Spin fix>
						<Icon :type="codeerror ? 'ios-close-circle' : 'ios-loading'" size="18" :class="codeerror ? 'error' : 'demo-spin-icon-load'" />
						<div :style="[{ color: codeerror ? 'red' : '' }]">{{ codeerror ? codeerror : '正在生成二维码' }}</div>
					</Spin>
				</div>
				<div style="margin-top: 7px;text-align: center;color: #FFFFFF;font-size: 18px;">
					<text @click="getCode('common')" style="padding: 0 10px;" :style="[{ color: codeType == 'common' ? '#0081ff' : '#ffffff' }]">普通码</text>
					|
					<text @click="getCode('weixin')" style="padding: 0 10px;" :style="[{ color: codeType == 'weixin' ? '#0081ff' : '#ffffff' }]">小程序码</text>
				</div>
			</div>
		</Form>
		<h4 @click="mouxan()" style="text-align: center;color: #0081ff;margin-top: 30px;">Powered By Mouxan</h4>
	</div>
</template>
<script>
import Checker from '@/libs/checker.js';
import { mapActions } from 'vuex';
import { validateUse, validatePass } from '@/libs/checker';
import { getcode, decode } from '@/api/login.js';
let loginType, loginType2;
export default {
	data() {
		return {
			iscode: true,
			codeimg: '',
			codeType: 'common',
			codeloading: false,
			loginForm: {
				username: 'admin',
				password: 'a123456'
			},
			rules: {
				username: [{ required: true, validator: validateUse, trigger: 'blur' }],
				password: [{ required: true, validator: validatePass, trigger: 'blur' }]
			},
			textType: 'password',
			loading: false,
			codeerror: ''
		};
	},
	methods: {
		...mapActions(['handleLogin', 'getUserInfo', 'scanLogin']),
		login: function(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.loading = true;
					try {
						await this.handleLogin(this.loginForm);
						this.loading = false;
					} catch (error) {
						this.loading = false;
					}
				} else {
					this.$Message.error('请输入完整信息！');
				}
			});
		},
		changeType() {
			this.textType = this.textType === 'password' ? 'text' : 'password';
		},
		changeMode() {
			this.iscode = !this.iscode;
			this.getCode();
			clearInterval(loginType);
			clearTimeout(loginType2);
		},
		async getCode(e) {
			clearInterval(loginType);
			clearTimeout(loginType2);
			if (!this.iscode) {
				this.codeType = e || 'common';
				this.codeimg = '';
				this.codeerror = '';
				this.codeloading = true;
				try {
					var res = await getcode({ codeType: this.codeType });
					if (res.code.code == 0) {
						const arrayBuffer = new Uint8Array(res.code.data.buffer.data);
						const base64 = uni.arrayBufferToBase64(arrayBuffer);
						this.codeimg = 'data:' + res.code.data.contentType + ';base64,' + base64;
						this.codeloading = false;
						this.checkLoginType(res.codeId);
					} else {
						this.codeerror = res.code.msg;
					}
				} catch (err) {
					this.codeerror = '生成失败';
				}
			}
		},
		/**
		 * 轮询查询是否扫描确认登录
		 * @param {Object} codeId
		 */
		async checkLoginType(codeId) {
			// 两秒查询一次，十分钟后删除循环
			loginType = setInterval(async () => {
				try {
					var res = await getcode({ codeId });
					console.log(res);
					if (res.uid) {
						clearInterval(loginType);
						await this.handleLogin({ uid: res.uid });
					}
				} catch (err) {
					clearInterval(loginType);
					this.codeloading = true;
					this.codeerror = err;
				}
			}, 2000);
			// 到时执行删除，防止数据库内容溢出
			loginType2 = setTimeout(async () => {
				clearInterval(loginType);
				await decode({ codeId })
			}, 600000);
		},
		mouxan() {
			window.open('https://gitee.com/mouxangitee', '_blank');
		}
	}
};
</script>
<style>
.error {
	color: red;
}
.demo-spin-icon-load {
	animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
	from {
		transform: rotate(0deg);
	}
	50% {
		transform: rotate(180deg);
	}
	to {
		transform: rotate(360deg);
	}
}
.page {
	background: url('@/assets/images/bg.jpg');
	background-size: 100%;
	width: 100%;
	height: 100%;
	overflow: hidden;
	margin: 0;
	padding: 0;
}

.code {
	position: absolute;
	right: 0;
	top: 0;
	width: 50px;
	height: 50px;
	text-align: center;
	line-height: 50px;
	background-color: #555555;
	border-bottom-left-radius: 50%;
	border-top-right-radius: 20px;
	padding: 5px;
}

.formlist {
	margin-top: 20px;
}

.login-form {
	position: relative;
	width: 400px;
	/* 容器自动水平居中 */
	margin: 0px auto;
	/* 实现垂直居中 距顶部高度  也可以写成 calc((100vh - 60vh)/2) */
	margin-top: calc((100vh - 50vh) / 2);
	border-radius: 20px;
	background-clip: padding-box;
	padding: 35px 35px 15px;
	background: #23232e;
	border: 1px solid #23232e;
	box-shadow: 0 0 10px #000;
}

.title {
	text-align: center;
	font-size: 33px;
	color: #0081ff;
	text-shadow: 0 0 5px #0081ff;
	font-weight: bold;
}

.login-btn {
	margin: 20px 0 10px 0;
	width: 100%;
	line-height: 40px;
	height: 40px;
	font-weight: bold;
	font-size: 19px;
	border: 0;
	color: #fff;
	background: linear-gradient(45deg, #0081ff, #1cbbb4);
}
</style>
